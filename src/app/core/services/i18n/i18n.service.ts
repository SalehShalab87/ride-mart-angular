import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class I18nService {
  //Step 1: Create a Variable to hold the current language and a variable to hold the translation file
  private readonly http = inject(HttpClient);
  public currentLang: 'en' | 'ar' = 'en';
  private translationFile: Record<string, any> = {};
  private isRTLSubject = new BehaviorSubject<boolean>(false);
  public isRTL$ = this.isRTLSubject.asObservable();

  // Step 2: Create a method to load the translation file based on the selected language
  async loadTranslationFile(lang: 'en' | 'ar'): Promise<boolean> {
    if (lang !== 'en' && lang !== 'ar') lang = 'en'; // Default to English if an unsupported language is provided
    localStorage.setItem('lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    if (lang === 'ar'){
      this.isRTLSubject.next(true); // Update RTL status
    }else{
      this.isRTLSubject.next(false); // Update RTL status
    }
    try {
      this.translationFile = await firstValueFrom(this.http.get<Record<string, any>>(`assets/i18n/${lang}.json`));
      this.currentLang = lang; // Update the current language after loading the file
      return true; // File loaded successfully
    } catch (error) {
      console.error('Failed to load translation file:', error);
      return false; // Failed to load translation file
    }
  }

  // Step 3: Create a method to translate keys based on the loaded translation file
  translate(key: string): string {
    const keys = key.split('.');
    let translation = this.translationFile;

    for (let i = 0; i < keys.length; i++) {
      if (translation[keys[i]] !== undefined) {
        translation = translation[keys[i]];
      } else {
        return key; // Return the key if translation is not found
      }
    }

    return typeof translation === 'string' ? translation : key;
  }
}
