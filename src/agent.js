const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
export default function Agent(){

	this.position = new THREE.Vector3(0.0,0.0,0.0);
	this.velocity = new THREE.Vector3(0.0,0.0,0.01);
	this.goal = new THREE.Vector3(5.0,0.0,5.0);
	this.orientation = new THREE.Vector3(0.0,0.0,0.0);
	this.size = 1.0;
	this.markers = []; //markers that 'belong' to this agent on a given frame

	var coneGeo = new THREE.ConeGeometry( 0.2, 0.4);
	var material = new THREE.MeshBasicMaterial( {color: 0xFFF68F} );
	this.mesh = new THREE.Mesh( coneGeo, material );

	this.computeMarkerWeight = function(marker){
		var vMarker = marker.position.clone().sub(this.position);
		var vGoal = this.goal.position.clone().sub(this.position);
		var theta = vMarker.angleTo(vGoal);
		var weight = (1.0 + Math.cos(theta))/(1.0 + vMarker.length);
		return weight;
	};

	this.update = function(){
		this.velocity = this.goal.clone().sub(this.position);
		
		//if we are really close to the goal, stop
		if (this.velocity.length() < 0.01){
			this.velocity = new THREE.Vector3(0.0,0.0,0.0);
		}else{ //otherwise, keep on truckin
			this.velocity.normalize().multiplyScalar(0.1);
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