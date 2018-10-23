import React from 'react';

const ListPlaces = props => {
  return (
    <div>
      {props.places.map(place => {
        return (
          <div key={place.id}>
            {place.name}
            <button onClick={() => props.deleteFunc(place.id)}>DELETE</button>
          </div>
        );
      })}
    </div>
  );
};

export default ListPlaces;
