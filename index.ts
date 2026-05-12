import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { App } from "./App";

export class FSMobileDatasetv2 implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private container!: HTMLDivElement;
  private root!: Root;

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this.container = container;
    this.root = createRoot(this.container);
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.root.render(
      React.createElement(App, {
        context: context,
        dataset: context.parameters.sampleDataSet
      })
    );
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {
    this.root.unmount();
  }
}