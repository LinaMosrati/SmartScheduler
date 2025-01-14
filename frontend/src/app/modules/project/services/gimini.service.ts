import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenerateContentResult, GoogleGenerativeAI } from "@google/generative-ai";
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GiminiService {

  private readonly apiKey = environment.apiKey;

  private readonly genAI = new GoogleGenerativeAI(this.apiKey);
  private readonly model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  constructor(private readonly http: HttpClient) {}

  async generateText(prompt: string): Promise<GenerateContentResult> {
    
    const result = await this.model.generateContent(prompt);
    return result;
    
  }
}
