import { ReactNode, Ref, forwardRef } from "react";
import { AppConsumer, PixiComponent, applyDefaultProps } from "@pixi/react";
import { Viewport, IViewportOptions } from "pixi-viewport";
import { Application, ICanvas, Graphics } from "pixi.js";

export type ViewportPlugins =
  | "drag"
  | "pinch"
  | "wheel"
  | "decelerate"
  | "bounce";
export type ViewportProps = {
  editing?: boolean;
  plugins?: ViewportPlugins[];
  children?: ReactNode | JSX.Element | JSX.Element[];
} & Pick<
  IViewportOptions,
  "screenHeight" | "screenWidth" | "worldHeight" | "worldWidth"
>;
type ViewportPropsWithApp = ViewportProps & { app: Application<ICanvas> };

/** Extract shared props for merging on component update */
const sharedProps = (props: ViewportProps) => {
  const { plugins = [], children, editing, ...rest } = props;
  return rest;
};

/** Custom viewport component: shares ticker and events from PixiApplication */
const PixiViewportComponent = PixiComponent("Viewport", {
  create(vProps: ViewportPropsWithApp) {
    const { app, plugins = [], editing, ...props } = vProps;
    const viewport = new Viewport({
      events: app.renderer.events,
      ticker: app.ticker,
      threshold: 10,
      stopPropagation: true,
      ...props
    });

    // activate plugins
    plugins.forEach((plugin) => viewport[plugin]());

    if (editing) {
      const line = viewport.addChild(new Graphics());
      line
        .lineStyle(4, 0xff00ff)
        .drawRect(0, 0, viewport.worldWidth, viewport.worldHeight);
    }

    // Fit contents to viewport and center
    viewport.snapZoom({ width: vProps.screenWidth, removeOnComplete: true });
    viewport.fit(true);
    return viewport;
  },
  applyProps(viewport, _oldP, _newP) {
    applyDefaultProps(viewport, sharedProps(_oldP), sharedProps(_newP));
  },

  config: { destroy: false, destroyChildren: true }
});

/** @PixiComponent `PixiViewport` is a container that enables zoom/drag functionality */
const PixiViewport = forwardRef((props: ViewportProps, ref: Ref<Viewport>) => (
  <AppConsumer>
    {(app) => <PixiViewportComponent ref={ref} app={app} {...props} />}
  </AppConsumer>
));

PixiViewport.displayName = "PixiViewport";
export default PixiViewport;
