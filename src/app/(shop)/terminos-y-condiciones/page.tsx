export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Términos y Condiciones</h1>

            <div className="prose prose-gray max-w-none">
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">1. Introducción</h2>
                    <p className="text-gray-600 mb-4">
                        Bienvenido a Tienda Laia. Al acceder y utilizar nuestro sitio web, aceptas cumplir con los siguientes términos y condiciones.
                        Te recomendamos leerlos detenidamente antes de realizar cualquier compra.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">2. Derecho de Revocación</h2>
                    <p className="text-gray-600 mb-4">
                        De acuerdo con la normativa vigente en Argentina (Ley de Defensa del Consumidor), tienes derecho a revocar tu compra dentro de los
                        <strong> 10 (diez) días corridos</strong> contados a partir de la fecha en que se entregue el producto o se celebre el contrato,
                        lo que ocurra último, sin responsabilidad alguna.
                    </p>
                    <p className="text-gray-600 mb-4">
                        Para ejercer este derecho, deberás poner el producto a disposición de Tienda Laia sin haberlo usado y manteniéndolo en el mismo estado
                        en que lo recibiste. Los gastos de devolución corren por cuenta del vendedor.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">3. Protección de Datos Personales</h2>
                    <p className="text-gray-600 mb-4">
                        En Tienda Laia nos tomamos muy en serio la privacidad de tus datos. La información personal que nos proporciones será utilizada
                        únicamente para procesar tus pedidos y mejorar tu experiencia de compra.
                    </p>
                    <p className="text-gray-600 mb-4">
                        Cumplimos con la Ley 25.326 de Protección de Datos Personales. Tienes la facultad de ejercer el derecho de acceso a tus datos personales
                        en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">4. Ropa Vintage</h2>
                    <p className="text-gray-600 mb-4">
                        Nuestros productos son prendas vintage seleccionadas. Debido a su naturaleza, pueden presentar signos de uso o desgaste propios del tiempo,
                        los cuales son detallados en la descripción de cada producto. Al comprar, aceptas estas condiciones.
                    </p>
                </section>
            </div>
        </div>
    )
}
