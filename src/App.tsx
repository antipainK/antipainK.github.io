import { Layout } from '@components/layout/Layout/Layout';
import { EducationList } from '@components/sections/EducationList/EducationList';
import { ExperienceTimeline } from '@components/sections/ExperienceTimeline/ExperienceTimeline';
import { Hero } from '@components/sections/Hero/Hero';

function App() {
  return (
    <Layout>
      <Hero />
      <ExperienceTimeline />
      <EducationList />
    </Layout>
  );
}

export default App;
