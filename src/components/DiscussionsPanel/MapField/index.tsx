import { loadModules } from 'esri-loader';
import { useMap, useWatch } from 'esri-loader-hooks';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useField, useForm } from 'react-final-form';

import { defaultConfig } from '../../MainMap';

interface Props {
  baseMap?: string;
}

const baseMapTypes = [
  'topo',
  'streets',
  'satellite',
  'hybrid',
  'dark-gray',
  'gray',
  'national-geographic',
  'oceans',
  'osm',
  'terrain',
  'dark-gray-vector',
  'gray-vector',
  'streets-vector',
  'streets-night-vector',
  'streets-navigation-vector',
  'topo-vector',
  'streets-relief-vector',
];

export const MapField = ({ baseMap = baseMapTypes[0] }: Props) => {
  const form = useForm();
  const field = useField('map');
  const [mapConfig] = useState({
    basemap: baseMap,
  });

  const options = {
    view: field.input.value
      ? {
          center: [field.input.value.longitude, field.input.value.latitude],
          zoom: field.input.value.zoom,
        }
      : defaultConfig,
  };

  const [ref, view]: any = useMap(mapConfig, options);

  useEffect(() => {
    loadModules(['esri/layers/FeatureLayer']).then(([FeatureLayer]) => {
      if (view) {
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
    });
  }, [view]);

  const onUpdateChange = useCallback(
    (updating: boolean, current: any, parameter: string, properties: any) => {
      if (!updating) {
        const {
          center: { longitude, latitude },
          zoom,
        } = properties;

        form.change('map', { longitude, latitude, zoom, baseMap: mapConfig.basemap });
      }
    },
    [],
  );

  useWatch(view, 'updating', onUpdateChange);

  return (
    <Fragment>
      <div style={{ height: '500px', width: '100%', zIndex: 0 }} ref={ref} />
    </Fragment>
  );
};

export default MapField;
