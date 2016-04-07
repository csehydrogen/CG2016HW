.PHONY: report.pdf all clean

all: report.pdf

report.pdf: report.tex
	latexmk -pdf -pvc -pdflatex="pdflatex -interaction=nonstopmode" -use-make report.tex

clean:
	latexmk -CA
