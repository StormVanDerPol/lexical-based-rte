import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useState, useEffect } from "react";
import lexicalToHTML from "../utils/htmlSerializer";
import HTMLToLexical from "../utils/lexicalSerializer";

export default function DebugView({ customFormatMap }) {
  const [editor] = useLexicalComposerContext();

  const [showHTML, setShowHTML] = useState(true);
  const [showCFEMap, setShowCFEMap] = useState(true);

  const [HTML, setHTML] = useState("");

  const [CustomHTML, setCustomHTML] = useState(
    `<p><strong>L’état civil et les coordonnées</strong></p><p>Le nom, la ville, le <a href="https://www.cv.fr/conseils/telephone-cv">numéro de téléphone</a> et l’<a href="https://www.cv.fr/conseils/adresse-mail-cv">adresse mail</a> font partie des informations essentielles à tout CV. On peut ensuite choisir d’ajouter ou non une <a href="https://www.cv.fr/conseils/photo-cv">photo</a>, de mentionner sa <a href="https://www.cv.fr/conseils/date-naissance-cv">date de naissance</a>, son <a href="https://www.cv.fr/conseils/permis-conduire-cv">permis de conduire</a>, son <a href="https://www.cv.fr/conseils/etat-matrimonial-cv">état matrimonial</a>, sa <a href="https://www.cv.fr/conseils/nationalite-cv">nationalité</a> ou encore ses <a href="https://www.cv.fr/conseils/linkedin-reseaux-sociaux-cv">réseaux sociaux</a>.</p><p>&#xFEFF;</p><p><strong>Le profil personnel</strong></p><p>Ajouter un petit texte pour se présenter n’est pas systématique mais c’est une bonne façon d’ajouter une touche personnelle à son CV ! Le <a href="https://www.cv.fr/conseils/profil-accroche-cv">profil personnel</a> ou le résumé personnel d’un CV consiste à résumer en quelques mots ou phrases qui vous-êtes et quels sont vos compétences et <a href="https://www.cv.fr/conseils/objectifs-cv">objectifs</a>, afin de vous présenter aux employeurs. De cette manière, cela ajoute une touche personnelle à votre CV et permet aux recruteurs de savoir immédiatement quel poste vous recherchez ou quels sont vos atouts. Cette sorte d’introduction se doit d’être accrocheuse, afin de donner envie aux recruteurs d’en savoir plus sur vous et de lire votre CV dans son intégralité ! Mieux vaut donc privilégier une accroche courte et qui répond au profil recherché par l’employeur.</p><p>&#xFEFF;</p><p><strong>La formation</strong></p><p>Baccalauréat, grandes écoles, universités… Vos domaines de formation, vos études et vos diplômes sont des éléments absolument essentiels dans la rédaction de votre CV. En effet, ces informations, avec vos expériences professionnelles, font partie des plus importantes pour les recruteurs puisqu’elles leurs permettent de savoir où et comment vous avez été formé, votre niveau de qualification et dans quel(s) domaine(s) vous êtes compétents. Le niveau de qualification peut d’ailleurs avoir un impact sur la rémunération, par exemple.</p><p>&#xFEFF;</p><p><strong>L’expérience professionnelle</strong></p><p>Dans cette rubrique, dites-en plus aux recruteurs sur vos expériences professionnelles, qu’il s’agisse de vos <a href="https://www.cv.fr/conseils/stages-cv">stages</a> ou précédents emplois. De cette manière, les recruteurs pourront se faire une idée plus précise de votre parcours et des missions qui ont été les vôtres au cours de vos précédents emplois, et ainsi en savoir plus sur vos compétences et ce que vous êtes capable d’accomplir. Pensez donc à donner des exemples concrets, comme la publication d’un étude, ou chiffrés si vous avez fait de bons résultats dans une précédente entreprise.</p><p>&#xFEFF;</p><p><strong>Les compétences</strong></p><p>Indiquer vos compétences et donc vos savoir-faire fait partie des incontournables de tout CV. Il peut s’agir des compétences informatiques (Excel, Photoshop, InDesign…) mais aussi de savoir-faire, aptitudes ou activités apprises ou que vous maîtrisez et qui peuvent être développées. Ce peut être la capacité à modéliser des maquettes en 3D, par exemple, réaliser des moulures ou à piloter une grue. Dans tous les cas, ces compétences doivent permettre de montrer aux recruteurs que vous êtes capables de mener à bien des missions particulières, qui vous distinguent des autres candidats !</p><p>&#xFEFF;</p><p><strong>Les langues étrangères</strong></p><p>Sans être forcément bilingue, les langues sont un atout de taille dans la recherche d’emploi et doivent donc apparaître dans le CV. Anglais, espagnol, italien, allemand, russe, japonais, chinois… Si l’anglais est la langue la plus courante, les autres <a href="https://www.cv.fr/conseils/langues-cv">langues étrangères</a> que l’on maîtrise peuvent être un sérieux atout pour sa candidature et permettre de se démarquer des autres candidats. Pensez à indiquer votre niveau, avec honnêteté, pour chacune d’entre elles !</p><p>&#xFEFF;</p><p><strong>Les centres d’intérêts et hobbies</strong></p><p>Si vous avez une ou plusieurs passions, vous pouvez tout à fait les mentionner sur votre CV ! Cela permettra aux recruteurs d’en savoir un peu plus sur votre personnalité et de vous démarquer des autres candidats à un même poste. Nous vous recommandons d’indiquer quatre <a href="https://www.cv.fr/conseils/centres-interets-hobbies-cv">hobbies</a> au maximum, afin de ne pas surcharger votre CV. Ceux que vous choisissez doivent donc présenter un intérêt tout particulier et être un véritable atout pour le poste visé. Pour vous démarquer des autres candidatures, choisissez des passions qui sont spéciales et qui montrent votre personnalité.</p><p>&#xFEFF;</p><p>À ces rubriques “classiques” peuvent bien sûr s’en ajouter d’autres.</p><p>&#xFEFF;</p><p><strong>Les activités extra professionnelles</strong></p><p>Il n’y a pas que les expériences professionnelles qui comptent dans un CV. Si vous êtes le trésorier d’une association sportive, que vous êtes engagé dans une organisation humanitaire ou que vous pratiquez l’alpinisme à haut niveau, dites-le ! Tout comme vos expériences professionnelles ou vos <a href="https://www.cv.fr/conseils/centres-interets-hobbies-cv">centres d’intérêts</a>, ces activités mettent en avant vos compétences et permettent d’en apprendre plus sur votre personnalité.</p><p>&#xFEFF;</p><p><strong>Les cours</strong></p><p>Vous vous êtes lancé dans un cours d’histoire de l’art, dans un atelier de menuiserie ou vous avez appris de nouvelles compétences en ligne, sur internet, grâce aux MOOC ? Dites-le dans votre CV ! Ces <a href="https://www.cv.fr/conseils/cours-cv">cours</a> élargissent votre champ de compétences et montrent aux recruteurs que vous êtes curieux et prêt à apprendre de nouvelles choses. Cela ne pourra que leur plaire !</p><p>&#xFEFF;</p><p><strong>Les stages</strong></p><p>Les stages sont une expérience professionnelle à part entière et, si vous faites votre entrée sur le marché du travail, il peut être bien de créer une rubrique qui leur est dédiée. Si vous avez déjà réalisé plusieurs stages, il est important, comme c’est le cas pour toute expérience professionnelle, de ne mentionner que ceux qui ont un véritable intérêt pour le poste visé.</p><p>&#xFEFF;</p><p><strong>Les objectifs</strong></p><p>Mentionner son objectif professionnel sur son CV permet d’informer les recruteurs sur vos aspirations, les choix de carrière que vous aimeriez faire et quels sont vos buts professionnels. Et cela prouve que vous avez de l’ambition !</p><p>&#xFEFF;</p><p><strong>Les références</strong></p><p>Les <a href="https://www.cv.fr/conseils/reference-cv">références</a> consistent à donner les coordonnées d’anciens contacts professionnels afin que les recruteurs puissent les contacter pour vérifier vos informations mais surtout pour connaître vos qualités et compétences et savoir quelle expérience cela a été de travailler avec vous. De cette manière, les recruteurs en sauront aussi un peu plus sur votre personnalité !</p>`,
  );

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      setHTML(lexicalToHTML(editor.getEditorState()));
    });
  }, [editor]);

  return (
    <>
      <div className="my-5 p-2 rounded bg-gray-200 shadow-md border border-gray-400">
        <button type="button" className="button primary xs" onClick={() => setShowHTML((b) => !b)}>
          -
        </button>

        {showHTML && (
          <>
            <div className="text-gray-600 text-sm mt-2 mb-5">rendered HTML:</div>

            <div
              className="rendered-rich-text"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: HTML,
              }}
            />
          </>
        )}
      </div>

      <pre className="bg-blue-900 text-white p-2 text-xs rounded my-2">
        <button type="button" className="button primary xs" onClick={() => setShowCFEMap((b) => !b)}>
          -
        </button>
        {showCFEMap && (
          <>
            <div>{`cfe state:\n`}</div>
            {JSON.stringify(Array.from(customFormatMap), null, 4)}
          </>
        )}
      </pre>

      <button
        type="button"
        className="button primary xs mb-2"
        onClick={() => {
          editor.setEditorState(editor.parseEditorState(JSON.stringify(HTMLToLexical(HTML))));
        }}
      >
        Reset editor state (Nothing should change)
      </button>

      <textarea className="block text-white p-2 rounded bg-black mb-2 w-full" placeholder="paste some html" value={CustomHTML} onChange={(e) => setCustomHTML(e.target.value)} />

      <button
        type="button"
        className="button primary xs mb-2"
        onClick={() => {
          const html = HTMLToLexical(CustomHTML);

          editor.setEditorState(editor.parseEditorState(JSON.stringify(html)));
        }}
      >
        Parse HTML from textarea
      </button>
    </>
  );
}
