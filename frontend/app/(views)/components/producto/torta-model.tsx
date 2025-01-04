"use client";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Cylinder, Sphere } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { Group } from "three";
import { Capa } from "@/app/models/capas";

export default function TortaModel({ capas }: { capas: Capa[] }) {
  const groupRef = useRef<Group>(null);

  // Dynamically adjust camera settings for responsiveness
  const { viewport } = useThree();
  const isSmallScreen = viewport.width < 768;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  const showDecoration = capas.length >= 3;

  const getCornerPositions = (radius: number, height: number) => {
    const positions = [];
    for (let angle = 0; angle < 360; angle += 45) {
      positions.push({
        x: radius * 0.8 * Math.cos((angle * Math.PI) / 180),
        y: height,
        z: radius * 0.8 * Math.sin((angle * Math.PI) / 180),
      });
    }
    return positions;
  };

  return (
    <group ref={groupRef}>
      <ambientLight intensity={isSmallScreen ? 0.5 : 0.7} />
      <pointLight position={[5, 10, 5]} intensity={1.2} />
      <pointLight position={[-5, -5, -5]} intensity={0.2} />

      {capas.map((layer, index) => {
        const radius = 1.5 - index * 0.1;

        return (
          <motion.group
            key={layer.id}
            initial={{ scale: 0, y: 5 }}
            animate={{
              scale: 1,
              y: index * 0.45,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 12,
              mass: 0.7,
            }}
          >
            {/* Cake Layer */}
            <Cylinder
              args={[radius, radius, 0.5, 32]}
              position={[0, index * 0.45, 0]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial
                color={layer.color}
                roughness={0.2}
                metalness={0.1}
                emissive={layer.color}
                emissiveIntensity={0.05}
              />
            </Cylinder>

            {/* Corner Decorations */}
            {getCornerPositions(radius, index * 0.45).map((pos, i) => (
              <Sphere
                key={i}
                args={[0.05, 8, 8]}
                position={[pos.x, pos.y + 0.25, pos.z]}
              >
                <meshStandardMaterial
                  color="#FFFFFF"
                  roughness={0.3}
                  metalness={0.1}
                  emissive="#FFFFFF"
                  emissiveIntensity={0.02}
                />
              </Sphere>
            ))}

            {/* Cream Layer */}
            {index < capas.length - 1 && (
              <Cylinder
                args={[radius, radius, 0.04, 32]}
                position={[0, index * 0.45 + 0.27, 0]}
                castShadow
                receiveShadow
              >
                <meshStandardMaterial
                  color="#FFF5E6"
                  roughness={0.3}
                  metalness={0.1}
                  emissive="#FFF5E6"
                  emissiveIntensity={0.02}
                />
              </Cylinder>
            )}

            {/* Decorations for 3+ layers */}
            {showDecoration && index === capas.length - 1 && (
              <motion.group
                initial={{ scale: 0, y: 0.5 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              >
                <Sphere
                  args={[0.15, 16, 16]}
                  position={[0, index * 0.45 + 0.4, 0]}
                >
                  <meshStandardMaterial
                    color="#FF96AD"
                    roughness={0.2}
                    metalness={0.3}
                    emissive="#FF96AD"
                    emissiveIntensity={0.1}
                  />
                </Sphere>

                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                  <Sphere
                    key={i}
                    args={[0.08, 16, 16]}
                    position={[
                      0.4 * Math.cos((angle * Math.PI) / 180),
                      index * 0.45 + 0.3,
                      0.4 * Math.sin((angle * Math.PI) / 180),
                    ]}
                  >
                    <meshStandardMaterial
                      color="#FFD700"
                      roughness={0.2}
                      metalness={0.4}
                      emissive="#FFD700"
                      emissiveIntensity={0.1}
                    />
                  </Sphere>
                ))}
              </motion.group>
            )}
          </motion.group>
        );
      })}
    </group>
  );
}
