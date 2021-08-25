<template>
<div ref="canvas"></div>

</template>

<script>
import * as THREE from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default {
  name: "ExperimentOne",

  data() {
    return {
      renderer: new THREE.WebGLRenderer({ alpha: true }),
      camera: new THREE.PerspectiveCamera( 45, 800 / 600, 1, 500 ),
      scene: new THREE.Scene(),
      mouse: new THREE.Vector2(),
    }
  },

  methods: {

  },

  computed: {
    navyMaterial() {
      return new THREE.LineBasicMaterial( { color: 0x022B3A } );
    }
  },

  mounted() {
    this.renderer.setSize( 800, 600 );
    this.$refs.canvas.appendChild( this.renderer.domElement );
    this.camera.position.set( 0, 0, 100 );
    this.camera.lookAt( 0, 0, 0 );
    const material =this.navyMaterial
    // var controls = new OrbitControls(this.camera, this.renderer.domElement)


    document.addEventListener("pointermove", event => {
      this.mouse.x = (event.clientX / window.innerWidth ) * 2 - 1

    })

    const points = [];
    const tests = [2, 62]
    for (let i = 0; i < tests.length; i++) {
      points.push( new THREE.Vector3( i, tests[i] * i, tests[i] * i ) );
      points.push( new THREE.Vector3( i, i, 0 ) );
      points.push( new THREE.Vector3( tests[i] * i, 10, i**i / i - 1 ) );
    }


    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line( geometry, material );


    this.scene.add( line );
    this.renderer.render( this.scene, this.camera );


  }
}
</script>