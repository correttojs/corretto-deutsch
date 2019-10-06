import React from 'react';
import { Button } from 'grommet';

export const SaveOffline: React.FC<{ items: { audio: string }[] }> = ({ items }) => {
  return (
    <>
      <Button
        onClick={() => localStorage.removeItem('apollo-cache-persist')}
        label={'Clean cache'}
      />
      <Button
        label={'Save Offline'}
        onClick={() => {
          caches.open('audio').then(cache => {
            items.map(item => {
              if (item.audio) {
                fetch(item.audio).then(response => {
                  if (response !== null) {
                    cache.put(item.audio, response);
                  }
                });
              }
            });
          });
        }}
      ></Button>
    </>
  );
};
