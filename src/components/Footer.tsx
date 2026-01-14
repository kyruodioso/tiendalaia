import Link from 'next/link'
import Image from 'next/image'
import RegretButton from './RegretButton'
import { Instagram, Mail } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="relative w-16 h-16 mb-4 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                            <Image
                                src="/logo.jpg"
                                alt="Laia Store"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <p className="text-gray-600 text-sm">
                            Moda vintage y sostenible para un estilo único.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Ayuda</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/shop" className="hover:text-black">Tienda</Link></li>
                            <li><Link href="/carrito" className="hover:text-black">Carrito</Link></li>
                            <li><Link href="/seguimiento" className="hover:text-black">Seguimiento</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Legales</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/terminos-y-condiciones" className="hover:text-black">Términos y Condiciones</Link></li>
                            <li><Link href="/politica-de-devoluciones" className="hover:text-black">Política de Devoluciones</Link></li>
                            <li><RegretButton /></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Contacto</h4>
                        <div className="flex flex-col space-y-3">
                            <a
                                href="https://instagram.com/laia23store"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
                            >
                                <Instagram size={18} />
                                @laia23store
                            </a>
                            <a
                                href="mailto:contacto.laia23@gmail.com"
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
                            >
                                <Mail size={18} />
                                contacto.laia23@gmail.com
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Tienda Laia. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
