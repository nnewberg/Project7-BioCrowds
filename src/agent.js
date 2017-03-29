const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
export default function Agent(){

	this.position = new THREE.Vector3(0.0,0.0,0.0);
	this.velocity = new THREE.Vector3(0.0,0.0,0.01);
	this.goal = new THREE.Vector3(5.0,0.0,5.0);
	this.orientation = new THREE.Vector3(0.0,0.0,0.0);
	this.size = 1.0;
	this.markers = []; //markers that 'belong' to this agent on a given frame
	var maxSpeed = 0.5;

	var coneGeo = new THREE.ConeGeometry( 0.2, 0.4);
	var material = new THREE.MeshBasicMaterial( {color: 0xFFF68F} );
	this.mesh = new THREE.Mesh( coneGeo, material );

	this.computeMarkerWeightedVector = function(marker){
		var vMarker = marker.position.clone().sub(this.position);
		var vGoal = this.goal.clone().sub(this.position);
		var theta = vMarker.angleTo(vGoal);
		var weight = (1.0 + Math.cos(theta))/(1.0 + Math.abs(vMarker.length()));
		// var numerator = (1.0 + Math.cos(theta));
		// var denom = (1.0 + vMarker.length());
		return vMarker.multiplyScalar(weight);
	};

	this.computeVelocity = function(){
		var velocity = new THREE.Vector3(0.0,0.0,0.0);
		
		for (var m = 0; m < this.markers.length; m++){
			var marker = this.markers[m];
			velocity.add(this.computeMarkerWeightedVector(marker));
		}

		return velocity;
	};

	this.update = function(){
		
		//if we are really close to the goal, stop
		if (this.goal.clone().sub(this.position).length() < 0.01){
			console.log("stop");
			this.velocity = new THREE.Vector3(0.0,0.0,0.0);
		}else{ //otherwise, keep on truckin
			// this.velocity.normalize().multiplyScalar(0.1);
			var weightedVelocity = this.computeVelocity();
			var speed = Math.min(weightedVelocity.length(), maxSpeed);
			this.velocity = weightedVelocity.normalize().multiplyScalar(speed);
		}
		
		this.position.add(this.velocity.clone().multiplyScalar(0.1));
		this.mesh.position.set(this.position.x, 0.2, this.position.z);

		//clear markers each frame
		for (var m = 0; m < this.markers.length; m++){
			this.markers[m].isOwned = false;
		}
		this.markers = [];
	};


};