import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as THREE from 'three';

@Component({
  selector: 'app-virus-info',
  templateUrl: './virus-info.component.html',
  styleUrls: ['./virus-info.component.css'],
})
export class VirusInfoComponent implements OnInit {
  @ViewChild('virusCanvas', { static: true }) canvasRef!: ElementRef;

  virusType: string = '';
  virusData: any;

  viruses = {
    covid: {
      name: 'SARS-CoV-2 (COVID-19)',
      description:
        'Coronavírus causador da COVID-19, doença respiratória que se tornou pandemia em 2020.',
      features: [
        'RNA vírus envelopado',
        'Período de incubação: 2-14 dias',
        'Taxa de mutação moderada',
      ],
      transmission:
        'Principalmente por gotículas respiratórias e aerossóis. Pode também se espalhar por superfícies contaminadas.',
    },
    influenza: {
      name: 'Vírus Influenza',
      description:
        'Causador da gripe, com surtos sazonais anuais e potencial pandêmico.',
      features: [
        'RNA vírus segmentado',
        'Alta taxa de mutação',
        'Vários subtipos (H1N1, H3N2, etc.)',
      ],
      transmission:
        'Gotículas respiratórias, contato direto com pessoas infectadas ou superfícies contaminadas.',
    },
    ebola: {
      name: 'Vírus Ebola',
      description:
        'Causador da doença do vírus Ebola, com alta letalidade em surtos esporádicos.',
      features: [
        'RNA vírus filamentoso',
        'Período de incubação: 2-21 dias',
        'Taxa de mortalidade de 25-90%',
      ],
      transmission:
        'Contato direto com fluidos corporais de pessoas infectadas ou animais selvagens.',
    },
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.virusType = this.route.snapshot.paramMap.get('type') || '';
    this.virusData = this.viruses[this.virusType as keyof typeof this.viruses];

    if (!this.virusData) {
      this.router.navigate(['/home']);
    } else {
      this.load3DModel();
    }
  }

  load3DModel() {
    const canvas = this.canvasRef.nativeElement;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.width, canvas.height);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.width / canvas.height,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Modelo básico do vírus (substitua por modelos específicos)
    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;

    switch (this.virusType) {
      case 'covid':
        geometry = new THREE.SphereGeometry(1, 32, 32);
        material = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          wireframe: true,
        });
        break;
      case 'influenza':
        geometry = new THREE.IcosahedronGeometry(1, 0);
        material = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          wireframe: true,
        });
        break;
      case 'ebola':
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
        material = new THREE.MeshBasicMaterial({
          color: 0x0000ff,
          wireframe: true,
        });
        break;
      default:
        geometry = new THREE.SphereGeometry(1, 32, 32);
        material = new THREE.MeshBasicMaterial({
          color: 0xffff00,
          wireframe: true,
        });
    }

    const virus = new THREE.Mesh(geometry, material);
    scene.add(virus);

    const animate = () => {
      requestAnimationFrame(animate);
      virus.rotation.x += 0.01;
      virus.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
