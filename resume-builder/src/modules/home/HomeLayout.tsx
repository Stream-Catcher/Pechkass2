import { AnimationGeneratorType, motion, useAnimation } from 'framer-motion';
import { NavBarActions, StyledButton } from '../builder/nav-bar/atoms';

import { BsGithub } from 'react-icons/bs';
import { Button } from '@mui/material';
import FeatureSection from './components/Feature';
import Image from 'next/image';
import Link from 'next/link';
import Person from './components/Person';

const HomeLayout = () => {
  const controls = useAnimation();
  const animationEffectsHoverEnter = { scale: 1.05 };
  const animationEffectsHoverLeave = { scale: 1 };
  const animationEffectsFirstLoad = {
    scale: [0.9, 1],
    opacity: [0, 1],
  };
  const transitionEffects = {
    type: 'spring' as AnimationGeneratorType,
    stiffness: 400,
    damping: 17,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1] }} className="scroll-smooth">
      {/* <nav className="sticky top-0 z-20 h-14 w-full .bg-resume-800 bg-orange-300 flex py-2.5 px-4 xl:px-60 items-center shadow-level-8dp"> */}
        {/* <Link href="/">
          <Image src={'/icons/resume-icon.png'} alt="logo" height="36" width="36" />
        </Link>
        <div className="flex-auto flex justify-between items-center ml-5">
          <NavBarActions>
            <Link href="/builder" passHref={true}>
              <StyledButton variant="text">Editor</StyledButton>
            </Link>
          </NavBarActions>
          <NavBarActions>
            <Link href="#contribute" passHref={true} className="max-md:hidden">
              <StyledButton variant="text">Contribute</StyledButton>
            </Link>
            <Link href="#about-us" passHref={true}>
              <StyledButton variant="text">Main Site</StyledButton>
            </Link>
            {/* <a
              href={'https://github.com/sadanandpai/resume-builder'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsGithub className="h-6 w-6" fill="white" />
            </a> */}
          {/* </NavBarActions> */}
        {/* </div> */}
      {/* </nav> */}

          <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 transition-all duration-300 ease-in-out">
  <div className="container mx-auto">
    <div className="flex items-center justify-between py-2">
      <a href="index.html" className="flex items-center gap-3 no-underline text-inherit">
        <div className="w-10 h-10 flex items-center justify-center text-2xl rounded-full bg-gradient-to-br from-orange-400 to-blue-900">
          🇮🇳
        </div>
        <div className="">
          <h3 className="text-lg text-orange-400 cursor-pointer m-0">PM Internship</h3>
          <span className="text-sm text-gray-500">Government of India</span>
        </div>
      </a>

      <nav className="flex items-center">
        <ul className="flex list-none gap-5 items-center m-0 p-0">
          <li>
            <a href="http://localhost:3000/" className="text-gray-700 font-medium px-4 py-2 rounded hover:text-orange-400 hover:bg-orange-100 transition-all">
              Resume Builder
            </a>
          </li>
          <li>
            <a href="http://localhost:8501/" className="text-gray-700 font-medium px-4 py-2 rounded hover:text-orange-400 hover:bg-orange-100 transition-all">
              ATS Score Checker
            </a>
          </li>
          <li>
            <a href="Chat/Chat.html" className="text-gray-700 font-medium px-4 py-2 rounded hover:text-orange-400 hover:bg-orange-100 transition-all">
              AI Job Board
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-700 font-medium px-4 py-2 rounded hover:text-orange-400 hover:bg-orange-100 transition-all">
              AI Interview
            </a>
          </li>
          {/* <li>
            <a href="#" className="text-gray-700 font-medium px-4 py-2 rounded hover:text-orange-400 hover:bg-orange-100 transition-all" >
              Mentorship
            </a>
          </li> */}
          {/* <li>
            <button className="text-gray-700 font-medium px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-all" onClick={() => (window.location.href = "Profile/profile.html")}>
              Profile
            </button>
          </li> */}
        </ul>
        {/* <button className="hidden text-xl text-gray-700 bg-none border-none cursor-pointer ml-2" onClick={toggleMobileNav}>
          <i className="fas fa-bars"></i>
        </button> */}
      </nav>
    </div>
  </div>
</header>


      <div
        style={{
          // #E7EEFA
          background: 'linear-gradient(180deg,  #ffbf69 50%, #FFFFFF 100%)',
          fontFamily: "'Roboto Slab', serif",
          marginTop: '4rem',
        }}
      >
        <div className="mx-6 md:mx-40 xl:mx-60 mb-6">
          <motion.div
            className="grid grid-cols-12 pt-12 md:pt-24"
            initial={{ opacity: 0 }}
            animate={animationEffectsFirstLoad}
            transition={transitionEffects}
          >
            <div className="col-span-12 sm:col-span-4">
              <motion.img
                id="resume-3d"
                src="/resume.webp"
                alt="resume-3d"
                className="w-6/12 sm:w-9/12"
                onMouseEnter={() => {
                  controls.start(animationEffectsHoverEnter, transitionEffects);
                }}
                onMouseLeave={() => {
                  controls.start(animationEffectsHoverLeave, transitionEffects);
                }}
                animate={controls}
              />
            </div>
            <div className="col-span-12 sm:col-span-8">
              <h3 className="text-xl md:text-2xl mb-2 text-resume-400">SIMPLEST WAY TO BUILD A</h3>
              <h1 className="text-5xl mb-12 text-resume-800">Professional Resume</h1>

              <div className="flex mb-10">
                <div className="bg-resume-800 w-1 rounded-lg"></div>
                <p className="text-lg ml-3 text-resume-800">
                  &ldquo;The secret to getting ahead is getting started&rdquo;
                  {/* &ldquo;भाइयों बहनों, गद्दारों को गोली मारो&rdquo; */}
                  <br />
                  {/* —मोदी चाय वाला */}
                  - Mark Twain 
                </p>
              </div>
              <Link href="/builder" passHref={true}>
                <div className="flex flex-col items-start">
                  <Button variant="contained" className="bg-resume-800 mb-2">
                    BUILD YOUR RESUME
                  </Button>
                  {/* <Button
                    variant="contained"
                    className="bg-[#698097] mb-2"
                  >
                    <a href="http://localhost:8501/">ATS SCORE CHECKER</a>
                  </Button> */}
                </div>
              </Link>
              <p
                className="xl:invisible text-resume-800"
                style={{ fontFamily: "'Roboto Slab', serif" }}
              >
                Desktop screen recommended
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="mx-6 md:mx-40 xl:mx-60 my-32"
        style={{ fontFamily: "'Roboto Slab', serif" }}
        initial={{ opacity: 0 }}
        animate={animationEffectsFirstLoad}
        transition={transitionEffects}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeatureSection />
        </div>
      </motion.div>

      {/* <div className="bg-resume-50 my-32">
        <div
          id="contribute"
          className="mx-6 md:mx-40 xl:mx-60 py-12"
          style={{ fontFamily: "'Roboto Slab', serif" }}
        >
          <div className="grid grid-cols-12 items-center text-center">
            <div className="col-span-12 lg:col-span-4 mb-4 lg:mb-0 flex flex-col items-center gap-2">
              <Image src={'/icons/palette.svg'} alt="logo" height="48" width="48" />
              <p className="text-resume-800 text-xl mt-2">
                Do you want to make your own <strong>template?</strong>
              </p>
            </div>
            <div className="col-span-12 lg:col-span-1 mb-4 lg:mb-0 text-resume-800 text-4xl">
              <p>+</p>
            </div>
            <div className="col-span-12 lg:col-span-2 flex flex-col items-center gap-2">
              <Image src={'/icons/terminal.svg'} alt="logo" height="48" width="48" />
              <p className="text-resume-800 text-xl mt-2">
                Do you write <strong>React</strong> code?
              </p>
            </div>
            <div className="invisible lg:visible lg:col-span-2 text-resume-800 text-4xl mx-6">
              <p>=</p>
            </div>
            <div className="col-span-12 lg:col-span-3 mx-auto flex flex-col items-center gap-2">
              <div className="mb-6">
                <Image src={'/icons/wave.svg'} alt="logo" height="48" width="48" />
              </div>
              <div>
                <a
                  href="https://github.com/sadanandpai/resume-builder"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="contained" className="bg-resume-800 mt-2 lg:mt-5 mb-3">
                    CONTRIBUTE
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div
        id="about-us"
        className="mx-6 md:mx-40 xl:mx-60 my-32"
        style={{ fontFamily: "'Roboto Slab', serif" }}
      >
        <h2 className="text-resume-800 text-3xl mb-2 text-center lg:text-left">About us</h2>
        <p className="text-resume-400 mb-8 text-center lg:text-left">
          A bunch of developers and designers — who love to build open source projects and learn
          along!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Person />
        </div>
        <p className="text-resume-400 my-8 text-center lg:text-left">
          Read our design story on&nbsp;
          <a
            href="https://medium.com/@yakshag/e-resume-build-a-professional-resume-design-case-study-3dc02a6359ea"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Medium
          </a>
          ↗
        </p>
      </div> */}
    </motion.div>
  );
};

export default HomeLayout;
