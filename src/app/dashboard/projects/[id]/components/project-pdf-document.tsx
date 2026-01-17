"use client";

import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";
import { ProjectDetails } from "@/types/project-details";

// Styles - using built-in Helvetica font
const styles = StyleSheet.create({
    page: {
        fontFamily: "Helvetica",
        fontSize: 10,
        padding: 40,
        backgroundColor: "#ffffff",
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: "#1a1a1a",
        paddingBottom: 15,
    },
    title: {
        fontSize: 24,
        fontFamily: "Helvetica-Bold",
        color: "#1a1a1a",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        color: "#666666",
    },
    badge: {
        backgroundColor: "#f1f5f9",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginTop: 8,
        alignSelf: "flex-start",
    },
    badgeText: {
        fontSize: 10,
        color: "#334155",
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: "Helvetica-Bold",
        color: "#1a1a1a",
        marginBottom: 10,
        backgroundColor: "#f8fafc",
        padding: 8,
        borderRadius: 4,
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 6,
    },
    infoLabel: {
        width: 120,
        color: "#666666",
        fontSize: 10,
    },
    infoValue: {
        flex: 1,
        fontSize: 10,
        color: "#1a1a1a",
    },
    summaryGrid: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20,
    },
    summaryCard: {
        flex: 1,
        padding: 12,
        backgroundColor: "#f8fafc",
        borderRadius: 6,
    },
    summaryCardHighlight: {
        flex: 1,
        padding: 12,
        backgroundColor: "#1a1a1a",
        borderRadius: 6,
    },
    summaryLabel: {
        fontSize: 9,
        color: "#666666",
        marginBottom: 4,
    },
    summaryLabelLight: {
        fontSize: 9,
        color: "#a1a1aa",
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 14,
        fontFamily: "Helvetica-Bold",
        color: "#1a1a1a",
    },
    summaryValueLight: {
        fontSize: 14,
        fontFamily: "Helvetica-Bold",
        color: "#ffffff",
    },
    table: {
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#1a1a1a",
        padding: 8,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    tableHeaderCell: {
        color: "#ffffff",
        fontSize: 9,
        fontFamily: "Helvetica-Bold",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        padding: 8,
    },
    tableRowAlt: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        padding: 8,
        backgroundColor: "#f8fafc",
    },
    tableCell: {
        fontSize: 9,
        color: "#374151",
    },
    tableCellBold: {
        fontSize: 9,
        color: "#1a1a1a",
        fontFamily: "Helvetica-Bold",
    },
    divisionHeader: {
        backgroundColor: "#e0f2fe",
        padding: 10,
        marginTop: 15,
        borderRadius: 4,
    },
    divisionTitle: {
        fontSize: 12,
        fontFamily: "Helvetica-Bold",
        color: "#0369a1",
    },
    divisionSubtitle: {
        fontSize: 9,
        color: "#0284c7",
        marginTop: 2,
    },
    taskHeader: {
        backgroundColor: "#f0fdf4",
        padding: 8,
        marginTop: 10,
        marginLeft: 10,
        borderRadius: 4,
    },
    taskTitle: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#15803d",
    },
    taskSubtitle: {
        fontSize: 8,
        color: "#22c55e",
        marginTop: 2,
    },
    itemsTable: {
        marginLeft: 20,
        marginTop: 5,
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        paddingTop: 10,
    },
    footerText: {
        fontSize: 8,
        color: "#9ca3af",
    },
    pageNumber: {
        fontSize: 8,
        color: "#9ca3af",
    },
    colNo: { width: "5%" },
    colItem: { width: "30%" },
    colType: { width: "12%" },
    colQty: { width: "10%", textAlign: "right" },
    colUnit: { width: "8%" },
    colPrice: { width: "17%", textAlign: "right" },
    colTotal: { width: "18%", textAlign: "right" },
});

interface ProjectPdfDocumentProps {
    project: ProjectDetails;
    formatCurrency: (value: number, currency?: string) => string;
}

export function ProjectPdfDocument({ project, formatCurrency }: ProjectPdfDocumentProps) {
    // Calculate totals
    const calculateProjectSubtotal = () => {
        return project.divisions.reduce((total, div) => {
            return total + div.tasks.reduce((taskTotal, task) => {
                return taskTotal + task.lineItems.reduce((itemTotal, item) => itemTotal + Number(item.lineTotal), 0);
            }, 0);
        }, 0);
    };

    const calculateTax = () => {
        return calculateProjectSubtotal() * (Number(project.taxRatePercent) / 100);
    };

    const calculateGrandTotal = () => {
        return calculateProjectSubtotal() + calculateTax();
    };

    const calculateDivisionTotal = (division: ProjectDetails["divisions"][0]) => {
        return division.tasks.reduce((taskTotal, task) => {
            return taskTotal + task.lineItems.reduce((itemTotal, item) => itemTotal + Number(item.lineTotal), 0);
        }, 0);
    };

    const calculateTaskTotal = (task: ProjectDetails["divisions"][0]["tasks"][0]) => {
        return task.lineItems.reduce((t, i) => t + Number(i.lineTotal), 0);
    };

    const totalDivisions = project.divisions.length;
    const totalTasks = project.divisions.reduce((t, d) => t + d.tasks.length, 0);
    const totalItems = project.divisions.reduce((t, d) =>
        t + d.tasks.reduce((tt, task) => tt + task.lineItems.length, 0), 0
    );

    const generatedDate = new Date().toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <Document>
            {/* Cover / Summary Page */}
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>{project.name}</Text>
                    {project.code && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{project.code}</Text>
                        </View>
                    )}
                    {project.description && (
                        <Text style={[styles.subtitle, { marginTop: 8 }]}>{project.description}</Text>
                    )}
                </View>

                {/* Project Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informasi Proyek</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Organisasi</Text>
                        <Text style={styles.infoValue}>{project.organization.name}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Pemilik</Text>
                        <Text style={styles.infoValue}>{project.owner.fullName}</Text>
                    </View>
                    {project.location && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Lokasi</Text>
                            <Text style={styles.infoValue}>{project.location}</Text>
                        </View>
                    )}
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mata Uang</Text>
                        <Text style={styles.infoValue}>{project.currency}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Tarif Pajak</Text>
                        <Text style={styles.infoValue}>{project.taxRatePercent}%</Text>
                    </View>
                </View>

                {/* Quick Stats */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ringkasan</Text>
                    <View style={styles.summaryGrid}>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Divisi Pekerjaan</Text>
                            <Text style={styles.summaryValue}>{totalDivisions}</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Total Pekerjaan</Text>
                            <Text style={styles.summaryValue}>{totalTasks}</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Total Item</Text>
                            <Text style={styles.summaryValue}>{totalItems}</Text>
                        </View>
                    </View>
                </View>

                {/* RAB Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Rencana Anggaran Biaya (RAB)</Text>
                    <View style={styles.summaryGrid}>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Subtotal</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(calculateProjectSubtotal(), project.currency)}</Text>
                        </View>
                        <View style={styles.summaryCard}>
                            <Text style={styles.summaryLabel}>Pajak ({project.taxRatePercent}%)</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(calculateTax(), project.currency)}</Text>
                        </View>
                        <View style={styles.summaryCardHighlight}>
                            <Text style={styles.summaryLabelLight}>Grand Total</Text>
                            <Text style={styles.summaryValueLight}>{formatCurrency(calculateGrandTotal(), project.currency)}</Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>Dibuat pada: {generatedDate}</Text>
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Halaman ${pageNumber} dari ${totalPages}`} />
                </View>
            </Page>

            {/* Detail Pages - One per Division */}
            {project.divisions.map((division, divIndex) => (
                <Page key={division.id} size="A4" style={styles.page}>
                    {/* Division Header */}
                    <View style={styles.divisionHeader}>
                        <Text style={styles.divisionTitle}>
                            {divIndex + 1}. {division.displayName}
                        </Text>
                        <Text style={styles.divisionSubtitle}>
                            Kode: {division.division.code} • {division.tasks.length} pekerjaan • Total: {formatCurrency(calculateDivisionTotal(division), project.currency)}
                        </Text>
                    </View>

                    {/* Tasks */}
                    {division.tasks.map((task, taskIndex) => (
                        <View key={task.id} wrap={false}>
                            {/* Task Header */}
                            <View style={styles.taskHeader}>
                                <Text style={styles.taskTitle}>
                                    {divIndex + 1}.{taskIndex + 1} {task.displayName}
                                </Text>
                                <Text style={styles.taskSubtitle}>
                                    {task.taskCatalog?.code && `Kode: ${task.taskCatalog.code} • `}
                                    {task.lineItems.length} item • Total: {formatCurrency(calculateTaskTotal(task), project.currency)}
                                </Text>
                            </View>

                            {/* Items Table */}
                            {task.lineItems.length > 0 && (
                                <View style={styles.itemsTable}>
                                    {/* Table Header */}
                                    <View style={styles.tableHeader}>
                                        <Text style={[styles.tableHeaderCell, styles.colNo]}>No</Text>
                                        <Text style={[styles.tableHeaderCell, styles.colItem]}>Item</Text>
                                        <Text style={[styles.tableHeaderCell, styles.colType]}>Tipe</Text>
                                        <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
                                        <Text style={[styles.tableHeaderCell, styles.colUnit]}>Satuan</Text>
                                        <Text style={[styles.tableHeaderCell, styles.colPrice]}>Harga Satuan</Text>
                                        <Text style={[styles.tableHeaderCell, styles.colTotal]}>Total</Text>
                                    </View>

                                    {/* Table Rows */}
                                    {task.lineItems.map((item, itemIndex) => (
                                        <View key={item.id} style={itemIndex % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                                            <Text style={[styles.tableCell, styles.colNo]}>{itemIndex + 1}</Text>
                                            <Text style={[styles.tableCellBold, styles.colItem]}>
                                                {item.itemCatalog?.name || item.description || "-"}
                                            </Text>
                                            <Text style={[styles.tableCell, styles.colType]}>
                                                {item.itemCatalog?.type || "-"}
                                            </Text>
                                            <Text style={[styles.tableCell, styles.colQty]}>{item.quantity}</Text>
                                            <Text style={[styles.tableCell, styles.colUnit]}>{item.unit?.code || "-"}</Text>
                                            <Text style={[styles.tableCell, styles.colPrice]}>
                                                {formatCurrency(Number(item.unitPrice), project.currency)}
                                            </Text>
                                            <Text style={[styles.tableCellBold, styles.colTotal]}>
                                                {formatCurrency(Number(item.lineTotal), project.currency)}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}

                    {/* Footer */}
                    <View style={styles.footer} fixed>
                        <Text style={styles.footerText}>{project.name}</Text>
                        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Halaman ${pageNumber} dari ${totalPages}`} />
                    </View>
                </Page>
            ))}
        </Document>
    );
}
