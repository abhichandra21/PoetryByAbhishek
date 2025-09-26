import type { FC, ReactElement, ReactNode } from 'react';
import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from 'react';

interface ActionTooltipProps {
  label: string;
  children: ReactNode;
  placement?: 'top' | 'bottom';
}

type MouseHandler = (event: React.MouseEvent<HTMLElement>) => void;
type FocusHandler = (event: React.FocusEvent<HTMLElement>) => void;

const ActionTooltip: FC<ActionTooltipProps> = ({ label, children, placement = 'top' }) => {
  const tooltipId = useId();
  const [visible, setVisible] = useState(false);
  const [computedPlacement, setComputedPlacement] = useState<'top' | 'bottom'>(placement);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  const enhanceChild = (child: ReactElement) => {
    const childProps = child.props as {
      onMouseEnter?: MouseHandler;
      onMouseLeave?: MouseHandler;
      onFocus?: FocusHandler;
      onBlur?: FocusHandler;
    };

    const handleEnter: MouseHandler = (event) => {
      show();
      childProps.onMouseEnter?.(event);
    };

    const handleLeave: MouseHandler = (event) => {
      hide();
      childProps.onMouseLeave?.(event);
    };

    const handleFocus: FocusHandler = (event) => {
      show();
      childProps.onFocus?.(event);
    };

    const handleBlur: FocusHandler = (event) => {
      hide();
      childProps.onBlur?.(event);
    };

    return cloneElement(child, {
      onMouseEnter: handleEnter,
      onMouseLeave: handleLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
      'aria-describedby': visible ? tooltipId : undefined,
    } as Partial<typeof childProps>);
  };

  useEffect(() => {
    if (!visible) {
      setComputedPlacement(placement);
      return;
    }

    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    const rect = wrapper.getBoundingClientRect();
    const margin = 16;

    setComputedPlacement((prev) => {
      let next = placement;

      if (placement !== 'bottom' && rect.top < margin) {
        next = 'bottom';
      } else if (placement !== 'top' && rect.bottom + margin > window.innerHeight) {
        next = 'top';
      } else {
        next = placement;
      }

      return next === prev ? prev : next;
    });
  }, [visible, placement]);

  return (
    <span ref={wrapperRef} className="relative inline-flex">
      {isValidElement(children) ? enhanceChild(children) : children}
      {visible && (
        <span
          role="tooltip"
          id={tooltipId}
          className="pointer-events-none select-none"
          style={{
            position: 'absolute',
            zIndex: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            [computedPlacement === 'top' ? 'bottom' : 'top']: 'calc(100% + 10px)',
            backgroundColor: 'var(--tooltip-bg, #faf6f2)',
            color: 'var(--tooltip-text, #333)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '0.75rem',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
          }}
        >
          {label}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: '10px',
              height: '10px',
              backgroundColor: 'var(--tooltip-bg, #faf6f2)',
              transform: 'rotate(45deg)',
              left: '50%',
              marginLeft: '-5px',
              [computedPlacement === 'top' ? 'top' : 'bottom']: '100%',
              borderLeft: computedPlacement === 'top' ? undefined : '1px solid rgba(0, 0, 0, 0.08)',
              borderTop: computedPlacement === 'top' ? undefined : '1px solid rgba(0, 0, 0, 0.08)',
              borderRight: computedPlacement === 'top' ? '1px solid rgba(0, 0, 0, 0.08)' : undefined,
              borderBottom: computedPlacement === 'top' ? '1px solid rgba(0, 0, 0, 0.08)' : undefined,
            }}
          />
        </span>
      )}
    </span>
  );
};

export default ActionTooltip;
