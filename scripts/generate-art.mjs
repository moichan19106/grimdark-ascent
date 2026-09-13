import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const STYLE =
  'Clean 2D animated illustration style, cel cartoon, bold slightly imperfect dark ink outlines, simplified anatomy, readable silhouettes, flat controlled colors, two levels of cel shading, minimal gradients, restrained highlights, slightly desaturated palette, high contrast, subtle printed grain texture, simple atmospheric background, graphic-novel composition, cinematic framing, serious and grim tone, immediately readable at web size.';

const NEG =
  'No text, no letters, no words, no numbers, no logos, no watermark, no photorealism, no 3D render, no anime styling, no chibi, no childish proportions, no watercolor, no excessive bloom.';

const ASSETS = [
  {
    name: 'hero-fates',
    size: '1152x864',
    prompt:
      'Four separate vertical portrait panels standing side by side as one cinematic montage on a dark smoky background, each panel a lone warrior from a very different dark far-future faction: a noble solemn superhuman knight in ornate blue and gold power armor, a grim soldier in a gas mask and dark military greatcoat, an ancient skeletal machine warrior of green-glowing living metal, and a corrupted warrior in baroque red and black spiked armor. Each figure stands fully independent in its own zone with clear separation between them, no arrows, no connections, no evolution, no chains between figures. Composition weighted toward the right side of the frame. ' +
      STYLE,
  },
  {
    name: 'path-pov',
    size: '1152x864',
    prompt:
      'Immersive close first-person perspective battlefield illustration, the viewer entering one single life in a dark far future: strong foreground depth with a lone soldier in a gas mask and long dark greatcoat seen from just behind the shoulder, holding a worn rifle, baroque ruins, smoke and drifting embers ahead of him, single clear focal character, moody overcast light. ' +
      STYLE,
  },
  {
    name: 'path-hierarchy',
    size: '1152x864',
    prompt:
      'Several visually distinct members of one single coherent military hierarchy presented independently at different levels of authority, all from the same army wearing long dark trench coats and gas masks with differing rank markers of authority: a young rifleman kneeling at the front, an experienced veteran sergeant standing with a trench shovel, a stern commanding officer in a heavier black greatcoat with a peaked cap behind him. Same faction, same visual family, arranged like a formal ranks presentation with clear vertical separation, dark smoky battlefield background, dim grey-green atmosphere, no arrows, no cross-species progression. ' +
      STYLE,
  },
  {
    name: 'path-transformation',
    size: '1152x864',
    prompt:
      'One single canon-plausible transformation shown as sequential but clearly related stages of the SAME warrior: left to right, the same young aspirant with the same face and hair color shown first as a bare recruit, then mid-surgery with black carapace grafts being fused to his body in a dim medical chamber, then fully encased as the same character inside massive blue power armor, same identity throughout, one fate escalating, no unrelated characters, dim industrial medical hall atmosphere. ' +
      STYLE,
  },
  {
    name: 'path-worlds',
    size: '1152x864',
    prompt:
      'A lone human survivor in a tattered cloak and respirator mask standing small on a rocky ridge inside a lethal far-future environment, a colossal toxic jungle of spore trees and acid mist around him, giant gothic industrial spires crumbling in the far distance, the environment is as important as the character and dominates the frame, green-grey atmosphere, sense of scale and danger. ' +
      STYLE,
  },
  {
    name: 'fate-portraits',
    size: '1440x704',
    prompt:
      'Exactly six circular framed head-and-bust portraits in ONE SINGLE horizontal row, evenly spaced left to right across a dark empty background, wide banner composition, all circles the same size and vertically centered on one line. Each circle is a completely separate warrior fate with a clearly differentiated head silhouette and faction color, left to right: a blue-armored transhuman warrior with stern shaved head, a red-and-brass berserker in a snarling helm, a gas-masked trench soldier in a steel helmet, a grey fur-trimmed northern warrior with wild pale hair and braided beard, a black-armored corrupted champion with pale skin and dark topknot, a hardened jungle fighter with a red bandana. One row of six circles only, no second row, no arrows between portraits, dark background. ' +
      STYLE,
  },
  {
    name: 'canon-method',
    size: '1152x864',
    prompt:
      'A restrained archive and dossier inspired illustration: character bust portraits pinned to a dark board among scattered papers, fragmentary star maps and hand-drawn tactical diagrams, wax seals and ribbon markers, dim candle-lit archive room atmosphere, scholarly and serious, abstract unreadable scribbles only for writing, no readable text. ' +
      STYLE,
  },
  {
    name: 'final-transmission',
    size: '1440x704',
    prompt:
      'Ultra wide cinematic battlefield horizon at dusk with a very large amount of negative space: a smoldering orange-grey sky over ash fields, and along the distant horizon several tiny independent silhouettes from very different wars, marching trench soldiers, a lone towering armored giant, a drifting war machine, separated from each other, quiet ominous stillness, minimal composition. ' +
      STYLE,
  },
];

async function main() {
  const outDir = path.resolve(process.cwd(), 'public/art');
  fs.mkdirSync(outDir, { recursive: true });
  const zai = await ZAI.create();
  const only = process.argv.slice(2);
  for (const asset of ASSETS) {
    if (only.length && !only.includes(asset.name)) continue;
    const outPath = path.join(outDir, `${asset.name}.png`);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 50000 && !only.length) {
      console.log(`skip existing ${asset.name}`);
      continue;
    }
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
      try {
        const response = await zai.images.generations.create({
          prompt: asset.prompt,
          size: asset.size,
        });
        const b64 = response.data?.[0]?.base64;
        if (!b64) throw new Error('no base64 in response');
        fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
        console.log(`OK ${asset.name} -> ${outPath} (${asset.size})`);
        ok = true;
      } catch (e) {
        console.error(`FAIL ${asset.name} attempt ${attempt}: ${e.message}`);
        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }
    if (!ok) process.exitCode = 1;
  }
}

main();
