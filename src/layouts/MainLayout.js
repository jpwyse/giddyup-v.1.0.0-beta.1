import React, { useCallback } from "react";
import { Outlet } from 'react-router-dom';
import Particles from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { Container as ParticlesContainer } from "tsparticles-engine";
import { loadFull } from "tsparticles";
import Box from '@mui/material/Box';
import particlesConfig from '../design/particles/particlesConfig';
import NavBar from '../layouts/NavBar';

const MainLayout = () => {
	const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: ParticlesContainer | undefined) => {
    //await console.log(container);
  }, []);


	return (
		<React.Fragment>
			<Particles init={particlesInit} loaded={particlesLoaded} options={particlesConfig} id="tsparticles"/>
			<NavBar />
			<Box
				component="main"
	      sx={{
	        display: 'flex',
	        flexDirection: 'column',
	        justifyContent: 'flex-start',
	        alignItems: 'center',
	        width: '100%',
	        height: '100vh',
	        background: 'none',
	        zIndex: -2,
	        overflow: 'auto',
	        whiteSpace: 'normal',
	        flexWrap: 'nowrap',
	        pt: 10,
	      }}
	    >
	    	<Outlet />
			</Box>
		</React.Fragment>
	);
};

export default MainLayout;