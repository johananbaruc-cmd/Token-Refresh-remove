import { View, Text, StyleSheet } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import { useAppSelector } from "../store/hooks";

export default function ProfileScreen() {
    const profile = useAppSelector((state) => state.profile.data);

    // Obtiene la primera letra del nombre para el avatar
    const initial = profile?.nombre ? profile.nombre.charAt(0).toUpperCase() : "?";

    return (
        <ScreenLayout title="Mi Perfil">
            <View style={styles.container}>
                {/* Avatar circular arriba */}
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initial}</Text>
                </View>

                {/* DATOS: solo nombre y correo */}
                <View style={styles.card}>
                    <Text style={styles.label}>Nombre</Text>
                    <Text style={styles.value}>
                        {profile?.nombre || "Sin nombre registrado"}
                    </Text>

                    <View style={styles.divider} />

                    <Text style={styles.label}>Correo</Text>
                    <Text style={styles.value}>
                        {profile?.email ?? ""}
                    </Text>
                </View>
            </View>
        </ScreenLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#2563EB",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    avatarText: {
        color: "#FFFFFF",
        fontSize: 38,
        fontWeight: "bold",
    },
    card: {
        width: "100%",
        padding: 20,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: "#EEEEEE",
    },
    label: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 4,
    },
    value: {
        fontSize: 18,
        color: "#111827",
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: "#F3F4F6",
        marginVertical: 16,
    },
});