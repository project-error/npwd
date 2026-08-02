import React, { Suspense } from 'react';
import { LayoutGrid } from 'lucide-react';

type IconComponentProps = {
  className?: string;
  style?: React.CSSProperties;
};

export const createLazyAppIcon =
  (
    Icon: React.LazyExoticComponent<React.ComponentType<IconComponentProps>>,
  ): React.FC<IconComponentProps> =>
  (props: IconComponentProps) => {
    return (
      <Suspense fallback={<LayoutGrid {...props} className={props.className} />}>
        <Icon {...props} />
      </Suspense>
    );
  };
