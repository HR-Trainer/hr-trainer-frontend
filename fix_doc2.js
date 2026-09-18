const fs = require('fs');
let content = fs.readFileSync('src/app/[locale]/(eleve)/formations/[id]/modules/[moduleId]/page.tsx', 'utf8');

// The block to replace:
// ) : (
//   <div className="absolute inset-0 bg-white dark:bg-[#111827] flex flex-col items-center justify-center text-slate-400 border border-slate-200 dark:border-gray-700 rounded-3xl">
//     <FileText size={64} className="mb-4 text-slate-300" />
//     <p>Ouvrir le document</p>
//     <a href={data?.module?.contenuUrl || '#'} target="_blank" className="mt-4 px-6 py-2 bg-[#0066FF] text-white font-bold rounded-xl text-sm">Télécharger / Voir</a>
//   </div>
// )}

const regexRenderer = /\) : \(\s*<div className="absolute inset-0 bg-white dark:bg-\[#111827\] flex flex-col items-center justify-center text-slate-400 border border-slate-200 dark:border-gray-700 rounded-3xl">[\s\S]*?Ouvrir le document[\s\S]*?<\/a>\s*<\/div>\s*\)}/g;

const newRenderer = `) : (
                  <>
                    {data?.module?.contenuUrl ? (
                      <iframe src={data?.module?.contenuUrl} className="w-full h-full border-0 absolute inset-0 z-10 bg-white dark:bg-slate-900 rounded-3xl" title="Document viewer" />
                    ) : (
                      <div className="absolute inset-0 bg-white dark:bg-[#111827] flex flex-col items-center justify-center text-slate-400 border border-slate-200 dark:border-gray-700 rounded-3xl">
                        <FileText size={64} className="mb-4 text-slate-300 dark:text-slate-600" />
                        <p>Aucun document disponible</p>
                      </div>
                    )}
                  </>
                )}`;

if (regexRenderer.test(content)) {
    content = content.replace(regexRenderer, newRenderer);
    fs.writeFileSync('src/app/[locale]/(eleve)/formations/[id]/modules/[moduleId]/page.tsx', content, 'utf8');
    console.log("Success replacing document renderer!");
} else {
    console.log("Failed to find document renderer block.");
}
