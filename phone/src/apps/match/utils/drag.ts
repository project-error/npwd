interface IDeltas {
  deltaX: number;
  deltaY: number;
}

/**
 * Given a React ref, which should point to some HTML element,
 * add draggable functionality to that element so the user can
 * interact with it.
 *
 * It should be noted that when using this in React that this
 * class is directly mutating the DOM, not relying on React state
 * to do so. This can cause some problems when relying on React
 * state updates based on the values derived from this class. That
 * is why we primarily use refs to interact with it.
 *
 * Order of operations:
 * 1. User clicks "down" on element - this initializes event
 * handlers and saves initial state
 * 2. User moves mouse. Every mouse move event triggers a movement
 * of the HTML element and also performs some logic to see how far
 * we have moved
 * 3. User "releases" mouse - cleanup event handlers and do logic
 * to compare our final position to our initial position
 */
export class DraggableElement {
  private element: HTMLElement;

  private width: number = 0;
  private initialX: number = 0;
  private initialY: number = 0;
  private mouseDownInitialX: number = 0;
  private mouseDownInitialY: number = 0;

  private useRotation: boolean;
  private maxRotationDeg: null | number;

  private updatedX: number = 0;
  private updatedY: number = 0;
  private mouseDownX: number = 0;
  private mouseDownY: number = 0;

  constructor(ref: React.MutableRefObject<any>, maxRotationDeg: number | null = null) {
    this.element = ref.current;
    this.width = this.element.clientWidth;
    this.maxRotationDeg = maxRotationDeg;
    this.useRotation = maxRotationDeg !== null;

    this.element.onmousedown = this.onMouseDown;
  }

  onMouseDown = (e: MouseEvent): void => {
    e.preventDefault();
    // get the mouse cursor position at startup:
    this.mouseDownX = e.clientX;
    this.mouseDownY = e.clientY;

    // save where we initially started dragging from
    // so we can do some math later
    this.mouseDownInitialX = this.mouseDownX;
    this.mouseDownInitialY = this.mouseDownY;

    document.onmouseup = this.onMouseUp;
    // call a function whenever the cursor moves:
    document.onmousemove = this.onMouseMove;
  };

  onMouseMove = (e: MouseEvent): void => {
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;
    this._onMouseMove(x, y);
  };

  _onMouseMove = (x: number, y: number): void => {
    // calculate the new cursor position:
    this.updatedX = this.mouseDownX - x;
    this.updatedY = this.mouseDownY - y;
    this.mouseDownX = x;
    this.mouseDownY = y;

    // set the element's new position:
    this.element.style.top = this.element.offsetTop - this.updatedY + 'px';
    this.element.style.left = this.element.offsetLeft - this.updatedX + 'px';

    if (this.useRotation) {
      const { deltaX } = this.deltas(this.mouseDownX, this.mouseDownY);
      const pctWidth = deltaX / this.width;
      const rotationDeg = -1 * this.maxRotationDeg * pctWidth;

      this.element.style.webkitTransform = `rotate(${rotationDeg}deg)`;
    }
  };

  onMouseUp = (e: MouseEvent): void => {
    e.preventDefault();
    this._onMouseUp();
  };

  _onMouseUp = (): void => {
    // stop moving when mouse button is released:
    this.cleanup();

    // revert back to intitial position
    this.element.style.left = `${this.initialX}px`;
    this.element.style.top = `${this.initialY}px`;
    if (this.useRotation) {
      this.element.style.webkitTransform = 'rotate(0deg)';
    }
  };

  cleanup = (): void => {
    document.onmouseup = null;
    document.onmousemove = null;
  };

  deltas = (x: number, y: number): IDeltas => {
    const deltaX = x - this.mouseDownInitialX;
    const deltaY = y - this.mouseDownInitialX;
    return { deltaX, deltaY };
  };
}

type StatusChange = (deltaX: number) => void;

/**
 * This class adds hooks to the base DraggableElement class
 * so we can update application state based on events
 */
export class LikeorDislikeDraggableElement extends DraggableElement {
  private onDrag: StatusChange;
  private onDrop: () => void;

  constructor(
    ref: React.MutableRefObject<any>,
    maxRotationDeg: number,
    onDrag: StatusChange,
    onDrop: () => void,
  ) {
    super(ref, maxRotationDeg);

    this.onDrag = onDrag;
    this.onDrop = onDrop;
  }

  onMouseMove = (e: MouseEvent): void => {
    e.preventDefault();
    const x = e.clientX;
    const y = e.clientY;

    const { deltaX } = this.deltas(x, y);

    this.onDrag(deltaX);
    this._onMouseMove(x, y);
  };

  onMouseUp = (): void => {
    this.onDrop();
    this._onMouseUp();
  };
}
