export default function ReturnsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Política de Devoluciones y Cambios</h1>

            <div className="prose prose-gray max-w-none">
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Proceso de Cambio para Ropa Vintage</h2>
                    <p className="text-gray-600 mb-4">
                        Entendemos que comprar ropa vintage online puede generar dudas sobre el calce. Si la prenda no te queda como esperabas,
                        puedes solicitar un cambio o devolución siguiendo estos pasos:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
                        <li>Contáctanos dentro de los 10 días de recibido el producto.</li>
                        <li>Asegúrate de que la prenda esté en las mismas condiciones en que fue enviada, sin uso adicional y con las etiquetas (si las tuviera).</li>
                        <li>Utiliza nuestro "Botón de Arrepentimiento" o escríbenos por WhatsApp para coordinar.</li>
                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Condiciones Generales</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                        <li>Los cambios están sujetos a disponibilidad de stock (al ser piezas únicas, se cambiará por otro producto de valor equivalente o se emitirá una nota de crédito).</li>
                        <li>Si ejerces tu derecho de revocación dentro de los 10 días, el reintegro del dinero se realizará por el mismo medio de pago utilizado.</li>
                        <li>Los costos de envío por cambio (no por devolución legal) pueden estar sujetos a cargo del cliente, salvo error nuestro.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Botón de Arrepentimiento</h2>
                    <p className="text-gray-600 mb-4">
                        Disponemos de un "Botón de Arrepentimiento" visible en nuestra web para facilitar la revocación de la compra de manera ágil y sencilla,
                        cumpliendo con la normativa de la Secretaría de Comercio Interior.
                    </p>
                </section>
            </div>
        </div>
    )
}
