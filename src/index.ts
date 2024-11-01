import "@eye-share/web-components/components";
import './helloworld.js';
import './allplayers.js';
import './allgames.js';
import './filterbuilder.js';
import './playercard.js';
import './playerscore.js';
import './addgameform.js';
import './addplayerform.js';
import './addgamerecordform.js';
import './navheader.js';
import {enTranslations, nbTranslations} from "@eye-share/web-components/translations"
import { isDottedTerm, Localizer, useLocalizer } from "@eye-share/web-components/utilities";
import { registerConsoleFilter } from "@eye-share/shared";
import { registerSymbolsIconLibrary, setIconBasePath } from "@eye-share/web-components/components";


const localizer = useLocalizer(new Localizer(isDottedTerm));

localizer.setTerms('en', enTranslations);
localizer.setTerms('nb', nbTranslations);

registerConsoleFilter();

setIconBasePath('/elo/docsite/vendor/icons');

registerSymbolsIconLibrary('default', 'bootstrap-icons.svg');
registerSymbolsIconLibrary('esd', 'es-design-icons.svg');