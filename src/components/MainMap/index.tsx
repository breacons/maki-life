import { loadModules } from 'esri-loader';
import { useMap, useWatch } from 'esri-loader-hooks';
import firebase from 'firebase/app';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { MapConfig } from '../../interfaces/discussions';
import {
  getScreenShotPath,
  getSelectedGraphics,
  setScreenShotPath,
  setSelectGraphics,
} from '../../redux/graphics';
import { useAppDispatch } from '../../redux/store';
import styles from './styles.module.less';

interface Props {
  config?: MapConfig;
  isEditingChange: boolean;
  isEditingRequest: boolean;
}

let Graphic: any;

export const defaultConfig = { center: [29, -5.64], zoom: 8 };

export const MainMap = ({ config, isEditingRequest, isEditingChange }: Props) => {
  const [graphicLayer, setGraphicLayer] = useState<any>();
  const { requestId, discussionId, changeId } = useParams<{
    discussionId: string;
    requestId: string;
    changeId: string;
  }>();

  const graphics = useSelector(getSelectedGraphics);
  const screenShotPath = useSelector(getScreenShotPath);
  const dispatch = useAppDispatch();

  const map = {
    basemap: 'streets',
  };
  const options = {
    view: config
      ? { center: [config.longitude, config.latitude], zoom: config.zoom }
      : defaultConfig,
  };

  const [ref, view]: any[] = useMap(map, options);

  useEffect(() => {
    if (view && config) {
      view.goTo({
        center: [config.longitude, config.latitude],
        zoom: config.zoom,
      });
    }
  }, [view, config]);

  useEffect(() => {
    if (view && view.map) {
      if (view && view.map && graphicLayer) {
        view.map.add(graphicLayer);
      }
    }
  }, [graphicLayer, view]);

  useEffect(() => {
    if (!graphicLayer) {
      loadModules(['esri/layers/GraphicsLayer', 'esri/Graphic', 'esri/layers/FeatureLayer']).then(
        ([GraphicsLayer, OGraphic, FeatureLayer]) => {
          if (view) {
            const graphicsLayer = new GraphicsLayer({});
            Graphic = OGraphic;

            if (graphics) {
              graphicsLayer.addMany(
                graphics.map((g: any) => {
                  return Graphic.fromJSON(g);
                }),
              );
            }
            setGraphicLayer(graphicsLayer);
            view.ui.move(['zoom'], 'bottom-left');

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
            view.map.add(featureLayer);
          }
        },
      );
    } else {
      graphicLayer.removeAll();
      if (graphics && Graphic) {
        graphicLayer.addMany(
          graphics.map((g: any) => {
            return Graphic.fromJSON(g);
          }),
        );
      }
    }
  }, [view, graphics, graphicLayer, Graphic]);

  useEffect(() => {
    const sketchId = 'sketch-widget';
    const editorId = 'editor-widget';
    if ((isEditingChange || isEditingRequest) && view && graphicLayer) {
      if (isEditingChange) {
        loadModules(['esri/widgets/Editor']).then(([Editor]) => {
          const editor = new Editor({
            view: view,
            layerInfos: [],
            id: editorId,
            snappingOptions: {
              enabled: true,
              selfEnabled: true,
              featureEnabled: true,
              featureSources: [],
            },
          });
          view.ui.add(editor, 'top-right');
        });
      } else {
        loadModules(['esri/widgets/Sketch']).then(([Sketch]) => {
          const sketch = new Sketch({
            layer: graphicLayer,
            view: view,
            creationMode: 'update',
            id: sketchId,
          });

          sketch.on(['create', 'update', 'delete', 'redo', 'undo'], (event: any) => {
            if (event.state === 'complete') {
              const graphicsAsJson = JSON.stringify(
                sketch.layer.graphics.items.map((g: any) => {
                  const { geometry, symbol } = g;
                  return new Graphic({ geometry, symbol });
                }),
              );
              dispatch(setSelectGraphics(JSON.parse(graphicsAsJson)));
            }
          });

          view.ui.add(sketch, 'top-right');
        });
      }
    } else {
      if (view) {
        const sketch = view.ui.find(sketchId);
        view.ui.remove(sketch);

        const editor = view.ui.find(editorId);
        view.ui.remove(editor);
      }
    }
  }, [view, graphicLayer, changeId, isEditingChange, isEditingRequest]);

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

  const take = async () => {
    if (view && view.ready) {
      if (config) {
        view.goTo({
          center: [config.longitude, config.latitude],
          zoom: config.zoom,
        });
      }

      view.takeScreenshot({ quality: 50, format: 'jpg' }).then(function (screenshot: any) {
        const storageRef = firebase.storage().ref();
        const id = screenShotPath as string;
        const childRef = storageRef.child(id);

        childRef.putString(screenshot.dataUrl, 'data_url').then(async (snapshot) => {
          const url = await snapshot.ref.getDownloadURL();
          if (requestId && discussionId) {
            const path = `discussions/${discussionId}/requests/${requestId}`;
            await firebase.database().ref(path).update({ screenShotUrl: url });
          }

          if (changeId && discussionId) {
            const path = `discussions/${discussionId}/changes/${changeId}`;
            await firebase.database().ref(path).update({ screenShotUrl: url });
          }
        });

        dispatch(setScreenShotPath({ path: null }));
      });
    }
  };

  useEffect(() => {
    if (screenShotPath) {
      take();
    }
  }, [screenShotPath, discussionId, requestId]);

  return <div className={styles.container} ref={ref} />;
};

export default MainMap;
