/**
 * Configuration des données de la carte Framacarte
 *
 * Ce module définit les couches de la carte et la configuration des marqueurs pour l'intégration Framacarte.
 * Chaque couche représente une catégorie de points d'intérêt qui peut être affichée/masquée sur la carte.
 *
 * Chaque couche contient:
 * - label: le nom affiché de la carte
 * - id: l'identifiant unique de la carte Framacarte
 * - color: la couleur du thème (info/blue, success/green, error/red, warning/orange, primary)
 * - checked: coché ou non pour afficher/masquer la couche
 * - icon: l'icône utilisée pour les marqueurs de cette couche
 */

export default [
  {
    label: "Tops Assos",
    id: "221549",
    color: "success",
    checked: ref(true),
    icon: "material-symbols:location-on",
  },
  {
    label: "Mauvaises Assos",
    id: "221570",
    color: "red",
    checked: ref(false),
    icon: "material-symbols:location-on",
  },
];
