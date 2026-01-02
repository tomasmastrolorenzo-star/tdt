"use client";

import React, { useState } from 'react';
import { LegalModal } from './legal-modal';

const TERMS_CONTENT = (
    <>
        <p className="indent-8">
            Al iniciar el escaneo, el usuario acepta un servicio de diagnóstico técnico de estatus digital. Trend Digital Trade identifica fricciones algorítmicas y viabilidad de verificación mediante tecnología de análisis de datos de 2026.
        </p>
        <p className="indent-8">
            Los informes generados son confidenciales y de uso exclusivo para el titular del activo analizado. No se garantizan resultados fuera de las métricas técnicas presentadas en el reporte final.
        </p>
    </>
);

const PRIVACY_CONTENT = (
    <>
        <p className="indent-8">
            La confidencialidad es nuestro estándar operativo. Trend Digital Trade realiza análisis perimetrales basados exclusivamente en datos públicos.
        </p>
        <p className="indent-8">
            Bajo ninguna circunstancia solicitamos credenciales de acceso o información privada. Los identificadores de contacto proporcionados se utilizan únicamente para la entrega del diagnóstico institucional y permanecen bajo encriptación estricta.
        </p>
    </>
);

export const Footer = () => {
    const [modalOpen, setModalOpen] = useState<'NONE' | 'TERMS' | 'PRIVACY'>('NONE');

    return (
        <>
            <footer className="border-t border-white/5 py-12 bg-black relative z-50">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Left: Brand */}
                    <div className="text-white/90 font-serif text-sm tracking-widest">
                        Trend Digital Trade
                    </div>

                    {/* Right: Minimal Links */}
                    <div className="flex space-x-8 text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
                        <button onClick={() => setModalOpen('PRIVACY')} className="hover:text-[#C5A059] transition-colors">Privacidad</button>
                        <button onClick={() => setModalOpen('TERMS')} className="hover:text-[#C5A059] transition-colors">Términos</button>
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
