'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function lerp(start: number, end: number, t: number) {
  return start * (1 - t) + end * t
}

export default function Eyes() {
  const eyesRef = useRef<HTMLDivElement>(null)
  const lastMouseEventRef = useRef<MouseEvent | null>(null)

  useEffect(() => {
    const eyeLeft = document.querySelector('[data-eye="left"] .eyes-svg__group') as SVGGElement;
    const eyeRight = document.querySelector('[data-eye="right"] .eyes-svg__group') as SVGGElement;

    const pupilLeft = document.querySelector('[data-eye="left"] .pupil') as SVGCircleElement;
    const pupilRight = document.querySelector('[data-eye="right"] .pupil') as SVGCircleElement;

    const mustache = document.querySelector('.mustache') as SVGPathElement;

    let leftEyeX = 0, leftEyeY = 0, rightEyeX = 0, rightEyeY = 0;
    let mustacheY = 0;
    let mustacheRotation = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const moveEye = (eye: SVGGElement, pupil: SVGCircleElement, eyeX: number, eyeY: number) => {
        const eyeRect = eye.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;

        const angle = Math.atan2(clientY - eyeCenterY, clientX - eyeCenterX);
        const eyeDistance = Math.min(
          Math.hypot(clientX - eyeCenterX, clientY - eyeCenterY),
          eyeRect.width / 4
        );
        const pupilDistance = Math.min(
          Math.hypot(clientX - eyeCenterX, clientY - eyeCenterY),
          eyeRect.width / 6
        );

        const targetEyeX = Math.cos(angle) * eyeDistance;
        const targetEyeY = Math.sin(angle) * eyeDistance;
        const targetPupilX = Math.cos(angle) * pupilDistance * 2.2;
        const targetPupilY = Math.sin(angle) * pupilDistance * 2.2;

        eyeX = lerp(eyeX, targetEyeX, 0.1);
        eyeY = lerp(eyeY, targetEyeY, 0.1);

        eye.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
        pupil.style.transform = `translate(${targetPupilX}px, ${targetPupilY}px)`;
        return [eyeX, eyeY];
      };

      [leftEyeX, leftEyeY] = moveEye(eyeLeft, pupilLeft, leftEyeX, leftEyeY);
      [rightEyeX, rightEyeY] = moveEye(eyeRight, pupilRight, rightEyeX, rightEyeY);

      // Animate mustache
      const normalizedX = (clientX / windowWidth) * 2 - 1; // Range from -1 to 1
      const targetY = normalizedX * 10; // Adjust the multiplier to control the amount of vertical movement
      mustacheY = lerp(mustacheY, targetY, 0.1);

      // Add a subtle rotation
      const targetRotation = normalizedX * 5; // Reduced rotation, adjust as needed
      mustacheRotation = lerp(mustacheRotation, targetRotation, 0.1);

      mustache.style.transform = `translateY(${mustacheY}px) rotate(${mustacheRotation}deg)`;
    };

    const animateEyes = () => {
      handleMouseMove(lastMouseEventRef.current || new MouseEvent('mousemove'));
      requestAnimationFrame(animateEyes);
    };

    document.addEventListener('mousemove', (e) => {
      lastMouseEventRef.current = e;
    });

    requestAnimationFrame(animateEyes);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute w-60 h-60 grid items-center right-0 top-0 bg-black/10 text-white rounded-full">
      <div className="container mx-auto p-12">
        <div className="grid items-center justify-center">
          {/* <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold mb-32 text-center"
          >
            Pronto para<br />iniciar um projeto?
          </motion.h2> */}
          <div className="grid grid-cols-2 eyes-svg justify-center items-center gap-4" ref={eyesRef}>

            <svg className="w-full h-auto overflow-visible" data-eye="left" width="200" height="201" viewBox="0 0 200 201" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="100" fill="#F4F4F4" />
              <g className="eyes-svg__group origin-center">
                <circle cx="100" cy="100" r="60" fill="#212121" />
                <circle className="pupil" cx="100" cy="100" r="8" fill="#F4F4F4" />
              </g>
            </svg>

            <svg className="w-full h-auto overflow-visible" data-eye="right" width="200" height="201" viewBox="0 0 200 201" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="100" fill="#F4F4F4" />
              <g className="eyes-svg__group origin-center">
                <circle cx="100" cy="100" r="60" fill="#212121" />
                <circle className="pupil" cx="100" cy="100" r="8" fill="#F4F4F4" />
              </g>
            </svg>
          </div>

          <div className="grid grid-cols-1 justify-center items-center ">
            <svg className="w-full overflow-visible" width="400" height="100" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g className="mustache origin-center" style={{transformOrigin: 'center'}}>
                <path className="fill-white" d="M201.1,41.9c1.1,2.3,3.4,4.5,4.5,5.7c10.2,12.5,20.4,22.7,34,30.6c17,10.2,34,13.6,53.2,12.5
                  c15.9-1.1,30.6-6.8,44.2-14.7c14.7-7.9,27.2-18.1,38.5-29.4c7.9-7.9,14.7-15.9,21.5-23.8c0-1.1,1.1-1.1,1.1-2.3l-1.1,1.1
                  c-6.8,6.8-14.7,12.5-23.8,15.9c-10.2,3.4-19.3,3.4-29.4,1.1c-10.2-2.3-20.4-6.8-29.4-12.5c-10.2-5.7-19.3-11.3-29.4-15.9
                  c-7.9-4.5-17-7.9-26-9.1C246.4-1.2,234,0,221.5,5.6c-6.8,3.4-13.6,7.9-20.4,13.6c0,0,0,0-1.1,1.1l0,0c0,0,0,0-1.1-1.1
                  c-5.7-5.7-12.5-10.2-20.4-13.6c-11.3-5.7-23.8-6.8-37.4-4.5c-9.1,2.3-18.1,4.5-26,9.1C104.9,15.8,95.8,20.3,85.6,26
                  c-9.1,4.5-19.3,10.2-29.4,12.5s-20.4,2.3-29.4-1.1c-9.1-3.4-17-9.1-23.8-15.9l-1.1-2.3c0,1.1,1.1,1.1,1.1,2.3
                  c6.8,7.9,13.6,17,21.5,23.8C35.8,56.6,49.4,66.8,63,74.7c13.6,7.9,28.3,12.5,44.2,14.7c19.3,2.3,37.4-2.3,53.2-12.5
                  c13.6-7.9,23.8-18.1,34-30.6C197.7,46.4,200,43,201.1,41.9L201.1,41.9z"/>
              </g>
            </svg>
          </div>

          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black px-8 py-4 rounded-full text-xl font-bold"
          >
            Iniciar projeto
          </motion.button> */}
        </div>
      </div>
    </motion.section>
  )
}