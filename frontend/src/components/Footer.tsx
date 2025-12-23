export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t py-4">
      <div className="max-w-screen-lg h-25 mx-auto flex flex-col items-center justify-center text-center text-sm text-gray-600 gap-2">
        <p>© 2025 UTE</p>
        <p>Built as part of the New Technologies course.</p>
        <p className="flex gap-4">
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Documentation
          </a>
          <span>|</span>
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub Repo
          </a>
          <span>|</span>
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline">
            Contact
          </a>
        </p>
      </div>
    </footer>

  );
}