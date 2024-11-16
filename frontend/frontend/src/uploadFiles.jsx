import React from 'react';
import { FileUpload } from 'primereact/fileupload';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

export default function AdvanceDemo() {
    
    const onUpload = (event) => {
        console.log('Archivos subidos:', event.files);
    };

    const onError = (event) => {
        console.error('Error al subir archivos:', event.files);
    };

    return (
        <div className="card p-4">
            <FileUpload 
                name="demo[]" 
                url={'/api/upload'} 
                multiple 
                accept="image/*" 
                maxFileSize={1000000} 
                onUpload={onUpload}
                onError={onError}
                emptyTemplate={<p className="m-0 text-center text-gray-600">Subir Archivos</p>}
                chooseOptions={{
                    label: 'Seleccionar Archivos',
                    className: 'bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded'
                }}
                uploadOptions={{
                    label: 'Subir',
                    className: 'bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded'
                }}
                cancelOptions={{
                    label: 'Cancelar',
                    className: 'bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded'
                }}
            />
        </div>
    );
}