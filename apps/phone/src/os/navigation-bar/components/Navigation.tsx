import { useSpring, animated, config } from '@react-spring/web';
import { useDrag, useGesture } from '@use-gesture/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();

  const [{ y }, api] = useSpring(() => ({ y: 0 }));

  const bind = useGesture(
    {
      onDrag: ({ down, movement: [, my], cancel }) => {
        api.start({ y: down ? my : 0 });
        if (my < -40) {
          cancel();
          api.start({ y: 0, immediate: false, config: config.wobbly });
        }
      },
    },
    { drag: { axis: 'y' } },
  );

  const handleGoBackInHistory = () => {
    // TODO: Check if we're on the base path
    navigate(-1);
  };

  const handleGoToMenu = () => {
    navigate('/');
  };

  return (
    <>
      <div className="bottom-0 absolute w-full mx-auto">
        <animated.div
          {...bind()}
          style={{ y }}
          className="w-full bg-transparent py-4 px-12 mx-auto text-center"
        >
          <button
            onClick={handleGoToMenu}
            className="bg-white h-2 w-14 rounded-md hover:bg-gray-300 transition duration-300 ease-in-out hover:scale-125"
          />
        </animated.div>
      </div>
    </>
  );
};
