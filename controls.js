function zoomIn(camera, target, move, minDist)
	{
		var cameraVector = new THREE.Vector3(target.position.x - camera.position.x, target.position.y - camera.position.y, target.position.z - camera.position.z);
		var length = cameraVector.length();
		length = Math.max(minDist,length-move);
		cameraVector.setLength(length);
		camera.position.x = target.position.x - cameraVector.x;
		camera.position.y = target.position.y - cameraVector.y;
		camera.position.z = target.position.z - cameraVector.z;
	}
	function zoomOut(camera, target, move, maxDist)
	{
		var cameraVector = new THREE.Vector3(target.position.x - camera.position.x, target.position.y - camera.position.y, target.position.z - camera.position.z);
		var length = cameraVector.length();
		length = Math.min(maxDist,length+move);
		cameraVector.setLength(length);
		camera.position.x = target.position.x - cameraVector.x;
		camera.position.y = target.position.y - cameraVector.y;
		camera.position.z = target.position.z - cameraVector.z;
	}

	function rotateAroundObjectAxis(camera, target, axis, angle) {
    		//from stackoverflow	
		rotObjectMatrix = new THREE.Matrix4();
    		rotObjectMatrix.makeRotationAxis(axis.normalize(), angle);

    		target.matrix.multiply(rotObjectMatrix);

    		target.rotation.setFromRotationMatrix(target.matrix);
		moveCameraAfterTargetRotation(camera, target, -angle)
	}
	
	function moveCameraAfterTargetRotation(camera, target, angle)
	{
		//moves the camera to maintain the same position relative to target after target turns	
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);
		
		var cameraVector = new THREE.Vector3(camera.position.x - target.position.x, camera.position.y - target.position.y, camera.position.z - target.position.z);
		newX = cos*cameraVector.x - sin*cameraVector.z;
		newZ = sin*cameraVector.x + cos*cameraVector.z;
		cameraVector.x = newX;
		cameraVector.z = newZ;	
		camera.position.x = target.position.x + cameraVector.x;
		camera.position.z = target.position.z + cameraVector.z;

	}
	function moveTargetForward(camera, target, distance)
	{
		//moves ourHero in the direction they are "facing" and maintains camera-hero relationship 
		var xdist = camera.position.x - target.position.x;
		var zdist = camera.position.z - target.position.z;
		target.translateZ(distance);
		camera.position.set(target.position.x + xdist, camera.position.y, target.position.z + zdist);
	}

	function changeCameraVertAngle(camera, target, angle)
	{
		//this function changes the angle the camera makes with the xz plane while keeping the distance from the object the same
		var xdist = camera.position.x - target.position.x;
		var ydist = camera.position.y - target.position.y;
		var zdist = camera.position.z - target.position.z;
		var cos = Math.cos(angle), sin = Math.sin(angle);
		var xzdist=Math.sqrt(xdist*xdist+zdist*zdist);
		var newX = (cos + sin*ydist/xzdist)*xdist;
		var newY = -sin*xzdist + cos*ydist;
		var newZ = (cos + sin*ydist/xzdist)*zdist;
		
		camera.position.set(target.position.x + newX, target.position.y + newY, target.position.z + newZ); 
	
	}

	function swingCamera(camera, target, angle)
	{
		//this function moves the camera about target in the xz plane keeping the same vertical angle	
		var xdist = camera.position.x - target.position.x;
		var zdist = camera.position.z - target.position.z;
		var cos = Math.cos(angle), sin = Math.sin(angle);
   		var newX = cos*xdist + sin*zdist;
		var newZ = -sin*xdist + cos*zdist;
		
		camera.position.set(target.position.x+newX, camera.position.y, target.position.z+newZ);
	}	
		
