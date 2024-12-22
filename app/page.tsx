"use client";

import '@/app/globals.css';
import React, { useState } from "react";
import { Upload, FileUp, Code2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface Token {
  type: string;
  value: string;
  line: number;
  char: number;
}

export default function Home() {
  const [tableData, setTableData] = useState<Token[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const text = await file.text();
    const lexedData = lexCppCode(text);
    setTableData(lexedData);
  };
  type Token = {
    type: string;
    value: string;
    line: number;
    char: number;
  };

  const lexCppCode = (code: string): Token[] => {
    const keywords = [
      'int', 'float', 'double', 'char', 'return', 'if', 'else', 'while', 'for',
      'switch', 'case', 'break', 'continue', 'default', 'void', 'const', 'bool',
      'class', 'struct', 'namespace', 'public', 'private', 'protected', 'virtual',
      'static', 'inline', 'template', 'typename', 'using', 'new', 'delete', 'this',
      'try', 'catch', 'throw', 'sizeof', 'true', 'false', 'nullptr'
    ];
    const operators = [
      '+', '-', '*', '/', '%', '=', '==', '!=', '<', '>', '<=', '>=', '&&', '||',
      '!', '++', '--', '+=', '-=', '*=', '/=', '%=', '&', '|', '^', '~', '<<', '>>'
    ];
    const delimiters = [';', ',', '(', ')', '{', '}', '[', ']'];

    const tokens: Token[] = [];
    let globalCharIndex = 0;

    const lines = code.split('\n'); // Split code into lines
    lines.forEach((line, lineIndex) => {
      let localCharIndex = 0;

      while (localCharIndex < line.length) {
        const char = line[localCharIndex];

        // Handle Preprocessor Directives
        if (localCharIndex === 0 && char === '#') {
          const directive = line.trim();
          tokens.push({
            type: 'Preprocessor Directive',
            value: directive,
            line: lineIndex + 1,
            char: globalCharIndex + 1,
          });
          globalCharIndex += line.length + 1; // Add entire line and newline
          return; // Move to next line
        }

        // Handle Numeric Literals
        if (char.match(/[0-9]/)) {
          let value = '';
          const startCharIndex = globalCharIndex;
          while (localCharIndex < line.length && line[localCharIndex].match(/[0-9]/)) {
            value += line[localCharIndex];
            localCharIndex++;
            globalCharIndex++;
          }
          tokens.push({
            type: 'Literal',
            value,
            line: lineIndex + 1,
            char: startCharIndex + 1,
          });
        }

        // Handle Keywords and Identifiers
        else if (char.match(/[a-zA-Z_]/)) {
          let value = '';
          const startCharIndex = globalCharIndex;
          while (localCharIndex < line.length && line[localCharIndex].match(/[a-zA-Z0-9_]/)) {
            value += line[localCharIndex];
            localCharIndex++;
            globalCharIndex++;
          }
          tokens.push({
            type: keywords.includes(value) ? 'Keyword' : 'Identifier',
            value,
            line: lineIndex + 1,
            char: startCharIndex + 1,
          });
        }

        // Handle Operators
        else if (operators.includes(char)) {
          tokens.push({
            type: 'Operator',
            value: char,
            line: lineIndex + 1,
            char: globalCharIndex + 1,
          });
          localCharIndex++;
          globalCharIndex++;
        }

        // Handle Delimiters
        else if (delimiters.includes(char)) {
          tokens.push({
            type: 'Delimiter',
            value: char,
            line: lineIndex + 1,
            char: globalCharIndex + 1,
          });
          localCharIndex++;
          globalCharIndex++;
        }

        // Handle Single-line Comments
        else if (char === '/' && line[localCharIndex + 1] === '/') {
          const comment = line.slice(localCharIndex);
          tokens.push({
            type: 'Comment',
            value: comment,
            line: lineIndex + 1,
            char: globalCharIndex + 1,
          });
          globalCharIndex += line.length - localCharIndex + 1; // Skip to end of line
          return; // Move to next line
        }

        // Handle Multi-line Comments
        else if (char === '/' && line[localCharIndex + 1] === '*') {
          let value = '/*';
          let startCharIndex = globalCharIndex;
          localCharIndex += 2;
          globalCharIndex += 2;

          while (
              line[localCharIndex] !== '*' ||
              line[localCharIndex + 1] !== '/'
              ) {
            value += line[localCharIndex];
            localCharIndex++;
            globalCharIndex++;
            if (localCharIndex >= line.length) {
              value += '\n';
              line = lines[++lineIndex]; // Go to next line
              localCharIndex = 0;
            }
          }
          value += '*/';
          tokens.push({
            type: 'Comment',
            value,
            line: lineIndex + 1,
            char: startCharIndex + 1,
          });
          localCharIndex += 2;
          globalCharIndex += 2;
        }

        // Handle whitespace and unrecognized characters
        else {
          localCharIndex++;
          globalCharIndex++;
        }
      }

      // Account for the newline character
      globalCharIndex++;
    });

    return tokens;
  };


  return (
      <div className="bg-blue-500 text-white p-4">
        <p>Tailwind CSS is working!</p>

  <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-indigo-700">
          <Code2 className="inline-block mr-2 mb-1"/>
          C++ Code Lexer
        </CardTitle>
        <CardDescription className="text-center text-indigo-500">
          Upload your C++ code and see it lexically analyzed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-8">
          <label htmlFor="file-upload" className="cursor-pointer">
            <div
                className="flex items-center justify-center w-64 h-32 border-2 border-dashed border-indigo-300 rounded-lg hover:border-indigo-500 transition-colors duration-300">
              <div className="text-center">
                <Upload className="mx-auto text-indigo-500"/>
                <span className="mt-2 text-sm text-indigo-700">
                    {fileName || "Choose a file"}
                  </span>
              </div>
            </div>
            <input
                id="file-upload"
                type="file"
                accept=".txt"
                onChange={handleUpload}
                className="hidden"
            />
          </label>
        </div>

        <AnimatePresence>
          {tableData.length > 0 && (
              <motion.div
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -20}}
                  transition={{duration: 0.5}}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/4">Type</TableHead>
                      <TableHead className="w-1/2">Value</TableHead>
                      <TableHead className="w-1/8">Line</TableHead>
                      <TableHead className="w-1/8">Character</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((token, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{token.type}</TableCell>
                          <TableCell>{token.value}</TableCell>
                          <TableCell>{token.line}</TableCell>
                          <TableCell>{token.char}</TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  </div>
      </div>
)
  ;
}
