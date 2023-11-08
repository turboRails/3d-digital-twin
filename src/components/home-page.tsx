"use client";
import Link from "next/link";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const effectController = {
  showDots: true,
  speed: 5,
  particleCount: 1000,
};

const ThreeScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (typeof window !== "undefined" && canvasRef.current != undefined) {
      const camera = new THREE.PerspectiveCamera(
        60,
        canvasRef.current.getBoundingClientRect().width /
          canvasRef.current.getBoundingClientRect().height,
        0.1,
        9000
      );
      camera.position.set(0, 8, 35);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000104); //BB4136
      // scene.fog = new THREE.FogExp2( 0x004404, 0.0001675 );

      const clock = new THREE.Clock();

      const parent = new THREE.Object3D();
      scene.add(parent);
      const grid = new THREE.Points(
        new THREE.PlaneGeometry(15000, 15000, 128, 256),
        new THREE.PointsMaterial({ color: 0xff0000, size: 10 })
      );
      grid.position.y = -800;
      grid.rotation.x = -Math.PI / 2;
      parent.add(grid);

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      });
      renderer.setSize(
        canvasRef.current.getBoundingClientRect().width,
        canvasRef.current.getBoundingClientRect().height
      );
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.autoClear = false;
      const cyGeometry = new THREE.CylinderGeometry(
        3,
        3,
        24,
        24,
        24
      ).toNonIndexed();
      const cyMaterial = new THREE.MeshStandardMaterial({
        color: "white",
        transparent: true,
        opacity: 0.6,
        metalness: 0.5,
      });

      const cube = new THREE.Mesh(cyGeometry, cyMaterial);
      cube.position.set(0, 5, 0);
      scene.add(cube);

      const ambientLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.3);
      ambientLight.position.set(1, 3, 1);

      scene.add(ambientLight);
      const pointLight = new THREE.DirectionalLight(0xffffff, 5);
      pointLight.position.set(40, 0, -1);
      pointLight.lookAt(0, 20, 0);
      scene.add(pointLight);

      const controls = new OrbitControls(camera, renderer.domElement);

      const fillWithPoints = (
        geometry: THREE.BufferGeometry,
        count: number
      ) => {
        const isInside = (v: THREE.Vector3) => {
          ray.set(v, dir);
          let counter = 0;

          let pos = geometry.attributes.position;
          let faces = pos.count / 3;
          let vA = new THREE.Vector3(),
            vB = new THREE.Vector3(),
            vC = new THREE.Vector3();
          for (let i = 0; i < faces; i++) {
            vA.fromBufferAttribute(pos, i * 3 + 0);
            vB.fromBufferAttribute(pos, i * 3 + 1);
            vC.fromBufferAttribute(pos, i * 3 + 2);
            if (ray.intersectTriangle(vA, vB, vC, false, dummyTarget))
              counter++;
          }

          return counter % 2 == 1;
        };
        const dummyTarget = new THREE.Vector3(); // to prevent logging of warnings from ray.at() method

        const ray = new THREE.Ray();

        const size = new THREE.Vector3();
        geometry.computeBoundingBox();
        let bbox = geometry.boundingBox;

        let pVec3: THREE.Vector3[] = [];

        const dir = new THREE.Vector3(1, 1, 1).normalize();
        for (let i = 0; i < count; i++) {
          let v = new THREE.Vector3(
            THREE.MathUtils.randFloat(
              (bbox?.min.x || 0) * 0.8,
              (bbox?.max.x || 0) * 0.8
            ),
            THREE.MathUtils.randFloat(bbox?.min.y || 0, bbox?.max.y || 0),
            THREE.MathUtils.randFloat(
              (bbox?.min.z || 0) * 0.8,
              (bbox?.max.z || 0) * 0.8
            )
          );
          if (isInside(v)) {
            pVec3.push(v);
          }
        }
        return new THREE.BufferGeometry().setFromPoints(pVec3);
      };

      const pointsGeom = fillWithPoints(
        cyGeometry,
        effectController.particleCount
      );
      
      const pointMat = new THREE.PointsMaterial({ vertexColors: true, color: 'aqua',size: 0.25})
      var colors=[];
       const vertices = pointsGeom.getAttribute("position").array
       for (var i = 0; i < vertices.length; i++) {
          colors.push(0 , 1 , 1)
       }
       const colorsA = new Float32Array(colors)
       pointsGeom.setAttribute( 'color', new THREE.BufferAttribute( colorsA, 3 ) );
      
       const pointCloud = new THREE.Points(
        pointsGeom,
        pointMat
      )
      cube.add(pointCloud)
         
      // setTimeout(() => {}, 5000);

      setTimeout(() => {
        cyMaterial.setValues({ emissive: "red" });
      }, 5000);

      let red = true;
      const toggleBG = () => {
        setTimeout(() => {
          if (red) {
            scene.background = new THREE.Color(0xbb4136);
            red = false;
          } else {
            scene.background = new THREE.Color(0x000000);
            red = true;
          }
          toggleBG();
        }, 1000);
      };
      setTimeout(() => {
        scene.background = new THREE.Color(0xbb4136)
        scene.remove(parent)
        toggleBG()
      }, 15000)

      const renderScene = () => {
        for (let i = 0; i < effectController.particleCount; i++) {
          vertices[i * 3 + 1] -= effectController.speed / 100 ;
          const minY = cyGeometry.boundingBox?.min.y || 0;
          if (vertices[i * 3 + 1] < minY) {
            vertices[i * 3 + 1] = cyGeometry.boundingBox?.max.y || 0;
          }

          vertices[i * 3] += THREE.MathUtils.randFloat(-0.02, 0.02);
          const minX = cyGeometry.boundingBox?.min.x || 0;
          const maxX = cyGeometry.boundingBox?.max.x || 0;
          if (vertices[i * 3] < minX * 0.8 || vertices[i * 3] > maxX * 0.8) {
            vertices[i * 3] = 1;
          }
          const minZ = cyGeometry.boundingBox?.min.z || 0;
          const maxZ = cyGeometry.boundingBox?.max.z || 0;
          if (
            vertices[i * 3 + 2] < minZ * 0.8 ||
            vertices[i * 3] > maxZ * 0.8
          ) {
            vertices[i * 3 + 2] = 1;
          }
        }

        pointCloud.geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(vertices, 3)
        );
        pointCloud.geometry.attributes.position.needsUpdate = true;

//        stats.update();

        renderer.render(scene, camera);
        controls.update();

        requestAnimationFrame(renderScene);
      };


      // Render the scene and camera
      renderer.render(scene, camera);

      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener("resize", handleResize);

      const initGUI = () => {
        const gui = new GUI();

        gui.add(effectController, "showDots").onChange(function (value) {
          pointCloud.visible = value;
        });
        gui
          .add(effectController, "speed", 0, 10, 1)
          .onChange(function (value) {
            effectController.speed = value;
          });
      };
      initGUI()
      
     // const stats = new Stats()
      // controlRef.current?.appendChild(stats.dom)

      // Call the renderScene function to start the animation loop
      renderScene();
      // Clean up the event listener when the component is unmounted
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [canvasRef]);
  return (
    <div>
      <div className="control" ref={controlRef} />
      <canvas className="canvas" ref={canvasRef} />
      <div className="relative mx-auto mt-4 rounded-lg  px-4 text-left leading-7 text-gray-600  sm:max-w-xl sm:px-12">
        <div className="main">
          <Link href="/birds">Birds</Link>
          <Link href="/boxes">Boxes</Link>
        </div>
      </div>
    </div>
  );
};

export default ThreeScene