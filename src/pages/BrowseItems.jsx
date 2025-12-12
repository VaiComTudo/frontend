import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";

function BrowseItems() {
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Categorias disponíveis, para já
    const categories = [
        { value: "ALL", label: "Todas as Categorias" },
        { value: "Bicycle", label: "Bicicletas" },
        { value: "Scooter", label: "Trotinetes" },
        { value: "Skate", label: "Skates" },
        { value: "Electric Bike", label: "Bicicletas Elétricas" },
    ];

    // Buscar listings disponíveis (todos ou por categoria)
    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                setError(null);

                // Construir URL com parâmetro de categoria se não for "ALL"
                let url = "http://localhost:8080/api/v1/renters/listings";
                if (selectedCategory !== "ALL") {
                    url += `?category=${encodeURIComponent(selectedCategory)}`;
                }

                const response = await axios.get(url, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const fetchedListings = response.data || [];
                setListings(fetchedListings);
                setFilteredListings(fetchedListings);
            } catch (err) {
                console.error("Error fetching listings:", err);
                setError(
                    err.response?.data?.message || "Erro ao carregar itens disponíveis"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [selectedCategory]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    return (
        <>
            <NavBar />
            <main
                style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "calc(100vh - 200px)",
                    padding: "20px",
                }}
            >
                <h1 style={{ marginBottom: "20px" }}>Procurar Itens Disponíveis</h1>

                {/* Filtro de Categoria */}
                <div style={{ marginBottom: "30px" }}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "10px",
                            fontSize: "16px",
                            fontWeight: "bold",
                        }}
                    >
                        Filtrar por Categoria:
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        style={{
                            width: "100%",
                            maxWidth: "400px",
                            padding: "10px",
                            fontSize: "16px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            cursor: "pointer",
                        }}
                    >
                        {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Mensagem de Erro */}
                {error && (
                    <div
                        style={{
                            padding: "15px",
                            backgroundColor: "#f8d7da",
                            color: "#721c24",
                            borderRadius: "5px",
                            marginBottom: "20px",
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <p>A carregar itens...</p>
                    </div>
                )}

                {/* Resultados */}
                {!loading && !error && (
                    <>
                        <div style={{ marginBottom: "20px" }}>
                            <p style={{ fontSize: "14px", color: "#666" }}>
                                {filteredListings.length} item(s) encontrado(s)
                                {selectedCategory !== "ALL" && ` na categoria "${categories.find(c => c.value === selectedCategory)?.label}"`}
                            </p>
                        </div>

                        {filteredListings.length === 0 ? (
                            <div
                                style={{
                                    padding: "40px",
                                    textAlign: "center",
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "5px",
                                }}
                            >
                                <p style={{ fontSize: "18px", color: "#666" }}>
                                    Nenhum item disponível nesta categoria.
                                </p>
                            </div>
                        ) : (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                                    gap: "20px",
                                }}
                            >
                                {filteredListings.map((listing) => (
                                    <div
                                        key={listing.id}
                                        style={{
                                            border: "1px solid #ddd",
                                            borderRadius: "8px",
                                            padding: "20px",
                                            backgroundColor: "#fff",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                            transition: "transform 0.2s, box-shadow 0.2s",
                                            cursor: "pointer",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-5px)";
                                            e.currentTarget.style.boxShadow =
                                                "0 4px 8px rgba(0,0,0,0.15)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                                        }}
                                    >
                                        <h3
                                            style={{
                                                marginTop: 0,
                                                marginBottom: "10px",
                                                color: "#333",
                                            }}
                                        >
                                            {listing.title}
                                        </h3>
                                        <p
                                            style={{
                                                marginBottom: "15px",
                                                color: "#666",
                                                fontSize: "14px",
                                                lineHeight: "1.5",
                                            }}
                                        >
                                            {listing.description}
                                        </p>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "20px",
                                                    fontWeight: "bold",
                                                    color: "#007bff",
                                                }}
                                            >
                                                €{listing.price?.toFixed(2)}
                                            </span>
                                            <span
                                                style={{
                                                    padding: "5px 10px",
                                                    backgroundColor: "#e7f3ff",
                                                    color: "#007bff",
                                                    borderRadius: "15px",
                                                    fontSize: "12px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {listing.vehicle?.type || "N/A"}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#999" }}>
                                            <p style={{ margin: "5px 0" }}>
                                                <strong>Estado:</strong>{" "}
                                                {listing.vehicle?.condition || "N/A"}
                                            </p>
                                            <p style={{ margin: "5px 0" }}>
                                                <strong>Recolha:</strong>{" "}
                                                {listing.pickUpLocation || "N/A"}
                                            </p>
                                            <p style={{ margin: "5px 0" }}>
                                                <strong>Entrega:</strong>{" "}
                                                {listing.dropOffLocation || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}

export default BrowseItems;

