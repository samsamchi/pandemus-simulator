import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

@Component({
  selector: 'app-virus-info',
  templateUrl: './virus-info.component.html',
  styleUrls: ['./virus-info.component.css'],
})
export class VirusInfoComponent implements OnInit {
  @ViewChild('virusCanvas', { static: true }) canvasRef!: ElementRef;

  virusType: string = '';
  virusData: any;
  isLoading: boolean = true;
  autoRotate: boolean = true;

  // Propriedades Three.js
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private animationFrameId: number = 0;

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
      modelPath: 'assets/models/covid19.fbx',
      scale: 0.0005,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      color: 0xdddddd,
      ambientLight: 0x404040,
      directionalLight: 0xffffff,
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
      modelPath: 'assets/models/influenza.fbx',
      scale: 1,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      color: 0xadd8e6,
      ambientLight: 0x404040,
      directionalLight: 0xffffff,
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
      modelPath: 'assets/models/ebola.fbx',
      scale: 0.1,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      color: 0x90ee90,
      ambientLight: 0x404040,
      directionalLight: 0xffffff,
    },
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.virusType = this.route.snapshot.paramMap.get('type') || '';
    this.virusData = this.viruses[this.virusType as keyof typeof this.viruses];

    if (!this.virusData) {
      this.router.navigate(['/home']);
    } else {
      this.initThreeJS();
      this.loadVirusModel();
    }
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Limpa recursos 3D para evitar vazamentos de memória
    if (this.renderer) {
      this.renderer.dispose();
    }

    // Limpa a cena
    if (this.scene) {
      this.scene.clear();
    }
  }

  private initThreeJS() {
    const canvas = this.canvasRef.nativeElement;

    // Configurar renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true, // fundo transparente
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      canvas.clientWidth || 400,
      canvas.clientHeight || 400
    );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Configurar cena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Configurar câmera
    const aspectRatio =
      (canvas.clientWidth || 400) / (canvas.clientHeight || 400);
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    // Adicionar controles de órbita para interatividade
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;
    this.controls.autoRotate = this.autoRotate;
    this.controls.autoRotateSpeed = 1.0;

    // Iluminação do modelo 3D
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Aumentei a intensidade para 1.5
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2); // Intensidade 2
    mainLight.position.set(10, 20, 15); // Posição mais alta para iluminação mais difusa
    mainLight.castShadow = true;
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1); // Luz mais forte
    fillLight.position.set(-10, 10, -10);
    this.scene.add(fillLight);

    // Responsive canvas resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private onWindowResize() {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 400;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private loadVirusModel() {
    // Configurações específicas do modelo
    const config = this.virusData;
    this.isLoading = true;

    // Carregar o modelo FBX
    const loader = new FBXLoader();
    loader.load(
      config.modelPath,
      (fbx) => {
        // Configurar scale, posição e rotação
        fbx.scale.set(config.scale, config.scale, config.scale);

        if (config.position) {
          fbx.position.set(
            config.position.x,
            config.position.y,
            config.position.z
          );
        }

        if (config.rotation) {
          fbx.rotation.set(
            config.rotation.x,
            config.rotation.y,
            config.rotation.z
          );
        }

        // Aplicar materiais e sombras a todo o modelo
        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Se não houver textura específica, usar a cor configurada
            if (!child.material.map) {
              child.material.color.set(config.color || 0xdddddd);
            }

            // Ativar sombras
            child.castShadow = true;
            child.receiveShadow = true;

            // Melhorar materiais existentes
            if (child.material) {
              child.material.roughness = 0.7;
              child.material.metalness = 0.3;
            }
          }
        });

        // Remover o modelo de carregamento
        this.scene.remove(
          this.scene.getObjectByName('loadingModel') as THREE.Object3D
        );

        // Adicionar modelo à cena
        this.scene.add(fbx);

        // Modelo carregado
        this.isLoading = false;

        // Animar
        this.animate();
      },
      // Progresso de carregamento
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% carregado');
      },
      // Erro de carregamento
      (error) => {
        console.error('Erro ao carregar o modelo:', error);
        // Manter o modelo de carregamento em caso de erro
        this.isLoading = false;
        this.animate();
      }
    );
  }

  private animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    // Atualizar controles de órbita
    if (this.controls) {
      this.controls.update();
    }

    // Renderizar cena
    this.renderer.render(this.scene, this.camera);
  }

  // Métodos para controles de interface
  toggleAutoRotation() {
    this.autoRotate = !this.autoRotate;
    if (this.controls) {
      this.controls.autoRotate = this.autoRotate;
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
