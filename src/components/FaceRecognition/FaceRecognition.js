import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({ imageUrl, boxes }) => {
	return (
		<div className="ma center">
			<div className="absolute mt3">
				<img id="input-image" src={imageUrl} alt="" width="500px" height="auto" />
				{ boxes.map( (box) =>
					<div className="bounding-box" style={{top: box.topRow , right: box.rightCol, bottom: box.bottomRow, left: box.leftCol }}></div>
					) }
				{
					[
					 <div></div>,
					 <div></div>
					]
				}
			</div>
		</div>
	);
}

export default FaceRecognition;