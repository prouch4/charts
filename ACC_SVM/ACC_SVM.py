import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import confusion_matrix
from mlxtend.plotting import plot_decision_regions
from matplotlib import cm

# Cargar datos
metabolites = pd.read_csv('ACC_SVM/acc_svm_data.csv')

# Limpiar datos
metabolites['NAAG_acc'] = metabolites['NAAG_acc'].astype(float)
metabolites['mI_acc'] = metabolites['mI_acc'].str.replace('.', '', regex=False).astype(float) / 1e12

# Variables
X = metabolites[['mI_acc', 'NAAG_acc']].values
y = metabolites['acc_condition'].values

# Escalar (igual que R que escala automáticamente)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Entrenar modelo SVM
svm2_acc = SVC(kernel='rbf', C=1.0, gamma=0.5, probability=True)
svm2_acc.fit(X_scaled, y)

# Gráfico
plt.figure(figsize=(8, 6))

# Usar colormap de matplotlib
plot_decision_regions(X=X_scaled, y=y, clf=svm2_acc, legend=2)

# Personalizar
plt.xlabel('mI_acc', fontsize=14)
plt.ylabel('NAAG_acc', fontsize=14)
plt.title('ACC SVM Classification Plot', fontsize=16)
plt.xticks(fontsize=12)
plt.yticks(fontsize=12)

# Mejorar leyenda
handles, labels = plt.gca().get_legend_handles_labels()
plt.legend(handles, ['HC', 'ACE'], loc='upper right', fontsize=12, framealpha=0.9)

plt.grid(False)

# Guardar la figura
#plt.savefig('svm_classification_plot.tiff', dpi=300, format='tiff', bbox_inches='tight')

plt.show()

# Nuevos datos simulados
acc_42ra = pd.DataFrame({
    'NAAG_acc': np.random.rand(10),
    'mI_acc': np.random.rand(10)
})

# Escalar nuevos datos igual que los datos originales
acc_42ra_scaled = scaler.transform(acc_42ra[['mI_acc', 'NAAG_acc']])

# Predicción
acc_clas2 = svm2_acc.predict(acc_42ra_scaled)
print('Predicciones:', acc_clas2)

# Matriz de confusión
acc_cm2 = confusion_matrix(y, svm2_acc.predict(X_scaled))
print('Matriz de confusión:\n', acc_cm2)

# Heatmap
plt.figure(figsize=(6, 5))
sns.heatmap(acc_cm2, annot=True, fmt='d', cmap='Blues')
plt.xlabel('Predicho', fontsize=12)
plt.ylabel('Real', fontsize=12)
plt.title('Matriz de Confusión', fontsize=14)

# Guardar heatmap
#plt.savefig('svm_confusion_matrix.tiff', dpi=300, format='tiff', bbox_inches='tight')

plt.show()
