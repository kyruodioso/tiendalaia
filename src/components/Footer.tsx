import Link from 'next/link'
import RegretButton from './RegretButton'

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Laia</h3>
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
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>Instagram: @laia.vintage</li>
                            <li>Email: hola@laia.com</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Tienda Laia. Todos los derechos reservados.</p>
                    <div className="mt-2 md:mt-0 text-right">
                        <p>Razón Social: [RAZON SOCIAL]</p>
                        <p>CUIT: [XX-XXXXXXXX-X]</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
