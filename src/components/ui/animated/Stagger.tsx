/**
 * Stagger - Wrapper to stagger animations of children
 * Automatically adds incremental delays to child animations
 */

import { Children, cloneElement, isValidElement, ReactNode } from "react";
import { View, ViewStyle } from "react-native";

interface StaggerProps {
  children: ReactNode;
  /** Base delay for the first child (ms) */
  baseDelay?: number;
  /** Delay increment between children (ms) */
  staggerDelay?: number;
  /** Style to apply to the container */
  style?: ViewStyle;
  /** Additional class names */
  className?: string;
}

/**
 * Wraps children and passes incremental delay props to each.
 * Children should accept a `delay` prop (like FadeIn, SlideIn, ScaleIn)
 */
export function Stagger({
  children,
  baseDelay = 0,
  staggerDelay = 50,
  style,
  className,
}: StaggerProps) {
  const staggeredChildren = Children.map(children, (child, index) => {
    if (isValidElement(child)) {
      return cloneElement(child as React.ReactElement<{ delay?: number }>, {
        delay: baseDelay + index * staggerDelay,
      });
    }
    return child;
  });

  return (
    <View style={style} className={className}>
      {staggeredChildren}
    </View>
  );
}
