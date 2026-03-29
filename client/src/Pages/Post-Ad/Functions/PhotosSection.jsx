import React from 'react';

// Component Imports
import SectionCard from '../Components/SectionCard';
import SectionTitle from '../Components/SectionTitle';

const PhotosSection = ({
  images,
  onAdd,
  onRemove,
  onSetPrimary,
  ImageUploader, // Passing the component itself as a prop
}) => {
  return (
    <SectionCard id="step-photos">
      <SectionTitle step="2" sub="Good photos get significantly more inquiries — add up to 10">
        Photos
      </SectionTitle>

      <ImageUploader
        images={images}
        onAdd={onAdd}
        onRemove={onRemove}
        onSetPrimary={onSetPrimary}
      />
    </SectionCard>
  );
};

export default PhotosSection;
