import { loadModules } from 'esri-loader';
import { useMap, useWatch } from 'esri-loader-hooks';
import React, { useCallback, useEffect, useState } from 'react';

interface Props {}

export const EditorMap = ({}: Props) => {
  const [graphicLayer, setGraphicLayer] = useState<any>();
  const map = {
    basemap: 'streets',
  };
  const options = {
    view: {
      center: [29, -5.64],
      zoom: 8,
    },
  };

  const [ref, view]: any = useMap(map, options);

  // useEffect(() => {
  //   // @ts-ignore
  //   if (view?.map) {
  //     // @ts-ignore
  //     if (view && view.map && graphicLayer) {
  //       // @ts-ignore
  //       view.map.add(graphicLayer);
  //     }
  //   }
  // }, [graphicLayer, view]);

  useEffect(() => {
    loadModules([
      'esri/widgets/Sketch',
      'esri/layers/GraphicsLayer',
      'esri/Graphic',
      'esri/layers/FeatureLayer',
      'esri/widgets/Editor',
    ]).then(([Sketch, GraphicsLayer, Graphic, FeatureLayer, Editor]) => {
      if (view) {
        // const graphicsLayer = new GraphicsLayer({});
        // const sketch = new Sketch({
        //   layer: graphicsLayer,
        //   view: view,
        //   creationMode: 'update',
        // });
        // setGraphicLayer(graphicsLayer);

        const featureLayer = new FeatureLayer({
          url:
            'https://services3.arcgis.com/3SFIyhf7mCINl5mN/arcgis/rest/services/chimpanzees/FeatureServer/0',
          outFields: ['*'],
          popupTemplate: {
            title: '{LEGEND}',
            content: '{SUBSPECIES} {CITATION}. {ASSESMENT} {ORIGIN} {PRESENCE} ',
          },
          definitionExpression: "SUBSPECIES = 'schweinfurthii'",
        });

        // featureLayer.filter = {
        //   where: 'SUBSPECIES = schweinfurthii',
        // };

        // @ts-ignore
        view.map.add(featureLayer);

        // sketch.on(['create', 'update', 'delete', 'redo', 'undo'], (event: any) => {
        //   if (event.state === 'complete') {
        //     console.log(
        //       'Current Graphics State',
        //       sketch.layer.graphics.items.map((g: any) => {
        //         const { geometry, symbol } = g;
        //         const graphic = new Graphic({ geometry, symbol });
        //         return graphic.toJSON();
        //       }),
        //     );
        //   }
        // });

        // @ts-ignore
        // view.ui.add(sketch, 'top-right');
        let pointLayer: any, lineLayer: any, polygonLayer: any;

        view.when(() => {
          // view.map.loadAll().then(() => {
          //   view.map.allLayers.forEach((layer: any) => {
          //     if (layer.type === 'feature') {
          //       switch (layer.geometryType) {
          //         case 'polygon':
          //           polygonLayer = layer;
          //           break;
          //         case 'polyline':
          //           lineLayer = layer;
          //           break;
          //         case 'point':
          //           pointLayer = layer;
          //           break;
          //       }
          //     }
          // });

          // Create layerInfos for layers in Editor. This
          // sets the fields for editing.

          const pointInfos = {
            layer: pointLayer,
            fieldConfig: [
              {
                name: 'HazardType',
                label: 'Hazard type',
              },
              {
                name: 'Description',
                label: 'Description',
              },
              {
                name: 'SpecialInstructions',
                label: 'Special Instructions',
              },
              {
                name: 'Status',
                label: 'Status',
              },
              {
                name: 'Priority',
                label: 'Priority',
              },
            ],
          };

          const lineInfos = {
            layer: lineLayer,
            fieldConfig: [
              {
                name: 'Severity',
                label: 'Severity',
              },
              {
                name: 'blocktype',
                label: 'Type of blockage',
              },
              {
                name: 'fullclose',
                label: 'Full closure',
              },
              {
                name: 'active',
                label: 'Active',
              },
              {
                name: 'locdesc',
                label: 'Location Description',
              },
            ],
          };

          const polyInfos = {
            layer: polygonLayer,
            fieldConfig: [
              {
                name: 'incidenttype',
                label: 'Incident Type',
              },
              {
                name: 'activeincid',
                label: 'Active',
              },
              {
                name: 'descrip',
                label: 'Description',
              },
            ],
          };

          const editor = new Editor({
            view: view,
            layerInfos: [
            ],
            // Set the snapping options for the Editor. By default, snapping is enabled. This can be toggled on/off using the CTRL key.
            snappingOptions: {
              enabled: true,
              selfEnabled: true,
              featureEnabled: true,
              featureSources: [
              ],
            },
          });
          // Add widget to top-right of the view
          view.ui.add(editor, 'top-right');
          // });
        });
      }
    });
  }, [view]);

  const onUpdateChange = useCallback(
    (updating: boolean, current: any, parameter: string, properties: any) => {
      if (!updating) {
        const {
          center: { longitude, latitude },
          zoom,
        } = properties;
        console.log(longitude, latitude, zoom);
      }
    },
    [],
  );

  useWatch(view, 'updating', onUpdateChange);

  return <div style={{ height: '100vh', width: '100%', zIndex: 0 }} ref={ref} />;
};

export default EditorMap;
