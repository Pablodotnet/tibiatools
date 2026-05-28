import { PagesCard } from "@/components/PagesCard";
import { useAuth } from '@/hooks';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className='w-full my-12'>
      <PagesCard isLoggedIn={isAuthenticated} />
    </div>
  );
};

export default HomePage;
