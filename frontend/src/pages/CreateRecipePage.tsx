import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { createRecipe } from '@/services/recipe.service';
import { getCategories } from '@/services/category.service';
import { getAreas } from '@/services/area.service';
import { getIngredients } from '@/services/ingredient.service';
import { Category } from '@/types/category.type';
import { Area } from '@/types/area.type';
import { Ingredient } from '@/types/ingredient.type';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StepFormData {
  order: number;
  description: string;
  images: File[];
  previewUrls: string[];
}

interface RecipeIngredientFormData {
  ingredientId: number;
  order: number;
  quantity: number;
  unit: string;
}

const CreateRecipePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [areaId, setAreaId] = useState<number>(0);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [thumbnailImages, setThumbnailImages] = useState<File[]>([]);
  const [thumbnailPreviews, setThumbnailPreviews] = useState<string[]>([]);
  const [steps, setSteps] = useState<StepFormData[]>([
    { order: 1, description: '', images: [], previewUrls: [] }
  ]);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredientFormData[]>([
    { ingredientId: 0, order: 1, quantity: 0, unit: '' }
  ]);

  // Options state
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  // Authentication check - redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('You must be logged in to create a recipe');
      navigate('/');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch options on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoadingOptions(true);
        const [categoriesRes, areasRes, ingredientsRes] = await Promise.all([
          getCategories({ page: 1, pageSize: 100 }),
          getAreas({ page: 1, pageSize: 100 }),
          getIngredients({ page: 1, pageSize: 500 })
        ]);

        if (categoriesRes.status === 'success') {
          setCategories(categoriesRes.data.categories);
        }
        if (areasRes.status === 'success') {
          setAreas(areasRes.data.areas);
        }
        if (ingredientsRes.status === 'success') {
          setIngredients(ingredientsRes.data.ingredients);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
        toast.error('Failed to load form options');
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  // Handle thumbnail uploads
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + thumbnailImages.length > 1) {
      toast.error('Maximum 1 thumbnail image allowed');
      return;
    }

    setThumbnailImages([...thumbnailImages, ...files]);
    
    // Generate preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setThumbnailPreviews([...thumbnailPreviews, ...newPreviews]);
  };

  // Remove thumbnail image
  const removeThumbnail = (index: number) => {
    URL.revokeObjectURL(thumbnailPreviews[index]);
    setThumbnailImages(thumbnailImages.filter((_, i) => i !== index));
    setThumbnailPreviews(thumbnailPreviews.filter((_, i) => i !== index));
  };

  // Handle category selection
  const toggleCategory = (categoryId: number) => {
    if (selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== categoryId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
    }
  };

  // Handle step management
  // Add new step
  const addStep = () => {
    setSteps([...steps, { 
      order: steps.length + 1, 
      description: '', 
      images: [], 
      previewUrls: [] 
    }]);
  };

  // Remove step
  const removeStep = (index: number) => {
    if (steps.length <= 1) {
      toast.error('At least one step is required');
      return;
    }
    
    // Revoke preview URLs
    steps[index].previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    const newSteps = steps.filter((_, i) => i !== index);
    // Reorder steps
    newSteps.forEach((step, i) => step.order = i + 1);
    setSteps(newSteps);
  };

  // Update step description
  const updateStepDescription = (index: number, description: string) => {
    const newSteps = [...steps];
    newSteps[index].description = description;
    setSteps(newSteps);
  };

  // Handle step image uploads
  const handleStepImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + steps[index].images.length > 3) {
      toast.error('Maximum 3 images per step');
      return;
    }

    const newSteps = [...steps];
    newSteps[index].images = [...newSteps[index].images, ...files];
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    newSteps[index].previewUrls = [...newSteps[index].previewUrls, ...newPreviews];
    
    setSteps(newSteps);
  };

  // Remove step image
  const removeStepImage = (stepIndex: number, imageIndex: number) => {
    const newSteps = [...steps];
    URL.revokeObjectURL(newSteps[stepIndex].previewUrls[imageIndex]);
    newSteps[stepIndex].images = newSteps[stepIndex].images.filter((_, i) => i !== imageIndex);
    newSteps[stepIndex].previewUrls = newSteps[stepIndex].previewUrls.filter((_, i) => i !== imageIndex);
    setSteps(newSteps);
  };

  // Handle ingredient management
  const addIngredient = () => {
    setRecipeIngredients([...recipeIngredients, {
      ingredientId: 0,
      order: recipeIngredients.length + 1,
      quantity: 0,
      unit: ''
    }]);
  };

  // Remove ingredient
  const removeIngredient = (index: number) => {
    if (recipeIngredients.length <= 1) {
      toast.error('At least one ingredient is required');
      return;
    }
    
    const newIngredients = recipeIngredients.filter((_, i) => i !== index);
    // Reorder ingredients
    newIngredients.forEach((ing, i) => ing.order = i + 1);
    setRecipeIngredients(newIngredients);
  };

  // Update ingredient fields
  const updateIngredient = (index: number, field: keyof RecipeIngredientFormData, value: number | string) => {
    const newIngredients = [...recipeIngredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setRecipeIngredients(newIngredients);
  };

  // Form validation
  const validateForm = (): boolean => {
    if (!name.trim()) {
      toast.error('Recipe name is required');
      return false;
    }
    if (!description.trim()) {
      toast.error('Recipe description is required');
      return false;
    }
    if (!areaId) {
      toast.error('Please select an area');
      return false;
    }
    if (selectedCategoryIds.length === 0) {
      toast.error('Please select at least one category');
      return false;
    }
    if (steps.some(step => !step.description.trim())) {
      toast.error('All steps must have descriptions');
      return false;
    }
    if (recipeIngredients.some(ing => !ing.ingredientId || !ing.quantity || !ing.unit.trim())) {
      toast.error('All ingredient fields must be filled');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to create a recipe');
      navigate('/');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await createRecipe({
        name,
        description,
        userId: parseInt(user.id),
        areaId,
        categoryIds: selectedCategoryIds,
        thumbnailImages: thumbnailImages.length > 0 ? thumbnailImages : undefined,
        steps: steps.map(step => ({
          order: step.order,
          description: step.description,
          images: step.images.length > 0 ? step.images : undefined
        })),
        recipeIngredients
      });

      if (response.status === 'success') {
        toast.success('Recipe created successfully!');
        // Clean up preview URLs
        thumbnailPreviews.forEach(url => URL.revokeObjectURL(url));
        steps.forEach(step => step.previewUrls.forEach(url => URL.revokeObjectURL(url)));
        
        // Navigate to the created recipe
        navigate(`/recipes/${response.data.id}`);
      } else {
        toast.error('Failed to create recipe');
      }
    } catch (error: any) {
      console.error('Error creating recipe:', error);
      toast.error(error.response?.data?.message || 'Failed to create recipe');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoadingOptions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-blue-light mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render form if not authenticated (will redirect via useEffect)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="font-semibold text-xl">Create New Recipe</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className='mb-2'>Recipe Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Traditional Pho"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className='mb-2'>Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your recipe..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="area" className='mb-2'>Area/Cuisine *</Label>
              <select
                id="area"
                value={areaId}
                onChange={(e) => setAreaId(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value={0}>Select an area</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>{area.name}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className='mb-2'>Categories * (select at least one)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                      selectedCategoryIds.includes(category.id)
                        ? 'bg-dark-blue text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thumbnail Images */}
        <Card>
          <CardHeader>
            <CardTitle>Thumbnail Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {thumbnailPreviews.map((preview, index) => (
                  <div key={index} className="relative w-32 h-32">
                    <img
                      src={preview}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeThumbnail(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                
                {thumbnailImages.length < 1 && (
                  <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors">
                    <Upload size={24} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Add Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredients *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recipeIngredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <select
                    value={ingredient.ingredientId}
                    onChange={(e) => updateIngredient(index, 'ingredientId', Number(e.target.value))}
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value={0}>Select ingredient</option>
                    {ingredients.map(ing => (
                      <option key={ing.id} value={ing.id}>{ing.name}</option>
                    ))}
                  </select>
                  
                  <Input
                    type="number"
                    step="0.01"
                    value={ingredient.quantity || ''}
                    onChange={(e) => updateIngredient(index, 'quantity', Number(e.target.value))}
                    placeholder="Quantity"
                    required
                  />
                  
                  <Input
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    placeholder="Unit (e.g., kg, cups)"
                    required
                  />
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeIngredient(index)}
                  disabled={recipeIngredients.length <= 1}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addIngredient}
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              Add Ingredient
            </Button>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Cooking Steps *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Step {step.order}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStep(index)}
                    disabled={steps.length <= 1}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                
                <Textarea
                  value={step.description}
                  onChange={(e) => updateStepDescription(index, e.target.value)}
                  placeholder="Describe this step..."
                  rows={3}
                  required
                />
                
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">
                    Step Images (up to 3)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {step.previewUrls.map((preview, imgIndex) => (
                      <div key={imgIndex} className="relative w-24 h-24">
                        <img
                          src={preview}
                          alt={`Step ${step.order} - Image ${imgIndex + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeStepImage(index, imgIndex)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    
                    {step.images.length < 3 && (
                      <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors">
                        <Upload size={20} className="text-gray-400" />
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleStepImageChange(index, e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addStep}
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              Add Step
            </Button>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1 cursor-pointer"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-dark-blue-light hover:bg-dark-blue-dark cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Recipe'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipePage;
