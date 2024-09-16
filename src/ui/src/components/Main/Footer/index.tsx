import { motion, MotionConfigProps, MotionValue, PanInfo, useTransform } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router';

interface FooterProps extends MotionConfigProps {
  y: MotionValue<number>;
}
export const Footer = ({ y, ...props }: FooterProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const opacity = useTransform(y, [-100, 0, 25, 75], [0, 1, 1, 0]);

  const handleDragEnd = (event: any, panInfo: PanInfo) => {
    if (panInfo.offset.y < -100) {
      navigate('/home');
    }
  };

  if (pathname === '/home') {
    return null;
  }

  return (
    <footer className="absolute bottom-0 w-full">
      <motion.div
        className="h-8 px-6 flex gap-4 items-center mt-auto"
        drag="y"
        dragTransition={{ bounceStiffness: 200, bounceDamping: 15 }}
        dragConstraints={{ top: 0, bottom: 0 }}
        animate={{ y: 0 }}
        initial={{ y: 50 }}
        dragElastic={0.4}
        whileDrag={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onDragEnd={handleDragEnd}
        style={{ y, opacity }}
        {...props}
      >
        <div className="h-1.5 bg-secondary rounded-full w-4/12 m-auto my-3" />
      </motion.div>
    </footer>
  );
};
