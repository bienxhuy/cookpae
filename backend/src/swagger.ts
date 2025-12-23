import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CookPac API Documentation",
      version: "1.0.0",
      description: "API documentation for the CookPac application",
    },
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              example: "john.doe@example.com",
            },
            role: {
              type: "string",
              enum: ["REGULAR_USER", "ADMIN"],
              example: "REGULAR_USER",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-12-17T10:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-12-17T10:00:00Z",
            },
          },
        },
        Area: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Italian",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-12-17T10:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-12-17T10:00:00Z",
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Dessert",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-12-17T10:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-12-17T10:00:00Z",
            },
          },
        },
        Ingredient: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Tomato",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-12-17T10:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-12-17T10:00:00Z",
            },
          },
        },
        Recipe: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Spaghetti Carbonara",
            },
            description: {
              type: "string",
              example: "Classic Italian pasta dish",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
            area: {
              $ref: "#/components/schemas/Area",
            },
            categories: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Category",
              },
            },
            thumbnails: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "integer",
                  },
                  publicId: {
                    type: "string",
                  },
                  url: {
                    type: "string",
                  },
                },
              },
            },
            steps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "integer",
                  },
                  order: {
                    type: "integer",
                    description: "Step order in the recipe",
                  },
                  description: {
                    type: "string",
                  },
                  attachments: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                        },
                        publicId: {
                          type: "string",
                        },
                        url: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
              },
            },
            recipeIngredients: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "integer",
                  },
                  order: {
                    type: "integer",
                  },
                  quantity: {
                    type: "number",
                    format: "float",
                  },
                  unit: {
                    type: "string",
                  },
                  ingredient: {
                    $ref: "#/components/schemas/Ingredient",
                  },
                },
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-12-17T10:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-12-17T10:00:00Z",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            message: {
              type: "string",
              example: "An error occurred",
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "routes/*.ts"),
    path.join(__dirname, "routes/*.js"),
  ]
});

export default swaggerSpec;
