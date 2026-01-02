"use client";

import React, { useState } from 'react';
import { LegalModal } from './legal-modal';

const TERMS_CONTENT = (
    <>
        <p>Bienvenido a Trend Digital Trade. Al utilizar nuestros servicios de auditoría forense y posicionamiento de autoridad, usted acepta someterse a los siguientes términos y condiciones:</p>
        <br />
        <h4 className="text-white font-serif mb-2">1. Naturaleza del Servicio</h4>
        <p>Nuestro sistema utiliza algoritmos de inteligencia de datos para analizar y potenciar perfiles digitales. No garantizamos resultados específicos fuera de los márgenes estadísticos presentados en el diagnóstico.</p>
        <br />
        <h4 className="text-white font-serif mb-2">2. Propiedad Intelectual</h4>
        <p>TodoListo el contenido generado, incluyendo reportes forenses y estrategias de identidad, es propiedad de Trend Digital Trade hasta el cumplimiento total del contrato.</p>
    </>
);

const PRIVACY_CONTENT = (
    <>
        <p>En Trend Digital Trade, la confidencialidad de sus datos es nuestra máxima prioridad operativa.</p>
        <br />
        <h4 className="text-white font-serif mb-2">1. Recolección de Datos</h4>
        <p>Solo recopilamos información pública disponible en redes sociales para fines de análisis forense. No almacenamos credenciales de acceso privadas.</p>
        <br />
        <h4 className="text-white font-serif mb-2">2. Uso de Información</h4>
        <p>Los datos de contacto (correo electrónico, teléfono) se utilizan exclusivamente para la entrega de reportes y comunicación ejecutiva.</p>
    </>
);

export const Footer = () => {
    const [modalOpen, setModalOpen] = useState<'NONE' | 'TERMS' | 'PRIVACY'>('NONE');

    return (
        <>
            <footer className="border-t border-white/5 pt-20 pb-10 bg-[#050505]">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <h4 className="text-white font-serif mb-4 text-xl">Trend Digital Trade</h4>
                        <p className="text-white/40 text-xs leading-relaxed uppercase tracking-widest">
                            Arquitectura de Identidad de Élite.<br />Operando bajo el Sistema V2.4
                        </p>
                    </div>
                    <div>
                        <h5 className="text-[10px] font-mono text-white/40 uppercase mb-4 tracking-widest">Protocolos</h5>
                        <ul className="text-white/60 text-sm space-y-2 font-light">
                            <li className="hover:text-[#007AFF] transition-colors cursor-pointer">Auditoría Forense</li>
                            <li className="hover:text-[#007AFF] transition-colors cursor-pointer">Ingeniería de Estatus</li>
                            <li className="hover:text-[#007AFF] transition-colors cursor-pointer">Blindaje de Reputación</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-[10px] font-mono text-white/40 uppercase mb-4 tracking-widest">Canal Ejecutivo</h5>
                        <a href="mailto:hola@trenddigitaltrade.com" className="group text-white transition-colors border-b border-white/20 pb-1 italic inline-block relative hover:text-[#007AFF] hover:border-[#007AFF]">
                            hola@trenddigitaltrade.com
                            <span className="absolute bottom-[-1px] left-0 w-0 h-[1px] bg-[#007AFF] transition-all duration-300 group-hover:w-full"></span>
                        </a>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-6 mt-20 flex justify-between items-center text-[10px] font-mono text-white/20 uppercase tracking-widest border-t border-white/5 pt-8">
                    <span>© 2026 Trend Digital Trade</span>
                    <div className="flex space-x-6">
                        <button onClick={() => setModalOpen('PRIVACY')} className="cursor-pointer hover:text-white transition-colors">Privacidad</button>
                        <button onClick={() => setModalOpen('TERMS')} className="cursor-pointer hover:text-white transition-colors">Términos</button>
                    </div>
                </div>
            </footer>

            <LegalModal
                isOpen={modalOpen === 'TERMS'}
                onClose={() => setModalOpen('NONE')}
                title="Términos y Condiciones"
                content={TERMS_CONTENT}
            />
            <LegalModal
                isOpen={modalOpen === 'PRIVACY'}
                onClose={() => setModalOpen('NONE')}
                title="Política de Privacidad"
                content={PRIVACY_CONTENT}
            />
        </>
    );
};
