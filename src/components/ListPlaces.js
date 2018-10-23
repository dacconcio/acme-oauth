import React from 'react';

const ListPlaces = props => {
  return (
    <div>
      {props.places.map(place => {
        return (
          <div key={place.id}>
            {place.name}
            <div onClick={() => props.deleteFunc(place.id)}>DELETE</div>
          </div>
        );
      })}
    </div>
  );
};

export default ListPlaces;
