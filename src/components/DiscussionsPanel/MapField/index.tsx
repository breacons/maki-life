import { loadModules } from 'esri-loader';
import { useMap, useWatch } from 'esri-loader-hooks';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useField, useForm } from 'react-final-form';
import { defaultConfig } from '../../MainMap';

interface Props {
  // graphics?: GraphicJSON[];
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
  const [mapConfig, setMapConfig] = useState({
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

  const [ref, view] = useMap(mapConfig, options);

  useEffect(() => {
    loadModules(['esri/layers/FeatureLayer', 'esri/widgets/BasemapGallery']).then(
      ([FeatureLayer, BasemapGallery]) => {
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

          // @ts-ignore
          view.map.add(featureLayer);

          // @ts-ignore
          view.map.on('layer-add', (...rest) => console.log('up', rest));

          // const basemapGallery = new BasemapGallery({
          //   view: view,
          //   source: {
          //     query: {
          //       title: '"World Basemaps for Developers" AND owner:esri',
          //     },
          //   },
          // });
          //
          // setBaseMapGallery(basemapGallery)
          //
          // basemapGallery.watch('activeBasemap', function (newValue: any, oldValue: any, property: any, object: any) {
          //   // console.log(
          //   //   JSON.stringify(newValue)
          //   // ); // In this example this value will always be the map object
          // });
          //
          // // @ts-ignore
          // view.ui.add(basemapGallery, 'top-right');
        }
      },
    );
  }, [view]);

  const onUpdateChange = useCallback(
    (updating: boolean, current: any, parameter: string, properties: any) => {
      // console.log('onUpdateChange');
      if (!updating) {
        // console.log(properties.map.basemap);
        // @ts-ignore
        // const baseMap = properties?.map?.basemap.id;
        //
        // if (baseMapGallery){
        //   // @ts-ignore
        //   console.log(baseMapGallery.activeBasemap)
        //   // @ts-ignore
        //   console.log(JSON.stringify(baseMapGallery.activeBasemap?.baseLayes?.items[0]))
        // }

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
  // useWatch(view, 'layer-add', (...rest: any) => console.log('la', rest));

  // @ts-ignore
  // console.log(view.map.basemap.id)

  if (view) {
    // @ts-ignore
    // console.log(JSON.stringify(view.map))
  }

  return (
    <Fragment>
      <div style={{ height: '500px', width: '100%', zIndex: 0 }} ref={ref} />
    </Fragment>
  );
};

export default MapField;
