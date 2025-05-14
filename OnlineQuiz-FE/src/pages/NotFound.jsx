import { Link } from 'react-router-dom';
import { router } from '~/routes';

function NotFound() {
  return (
    <main className="grid min-h-screen px-6 py-24 bg-white place-items-center sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
        <p className="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
        <div className="flex items-center justify-center mt-10 gap-x-6">
          <Link
            to={router.root}
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm transition-all font-semibold text-white shadow-sm hover:text-white hover:shadow-success_hover"
          >
            Go back home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
