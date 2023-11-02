import re

from setuptools import find_packages, setup


def get_version():
    """Get package version from app_info.py file"""
    filename = "p8hub/app_info.py"
    with open(filename, encoding="utf-8") as f:
        match = re.search(
            r"""^__version__ = ['"]([^'"]*)['"]""", f.read(), re.M
        )
    if not match:
        raise RuntimeError(f"{filename} doesn't contain __version__")
    version = match.groups()[0]
    return version


def get_install_requires():
    """Get python requirements based on context"""
    install_requires = [
        "urllib3>=2.0.2",
        "extract-msg>=0.41.1",
        "tabulate>=0.9.0",
        "python-multipart>=0.0.6",
        "fastapi==0.96.0",
        "SQLAlchemy==2.0.15",
        "alembic==1.11.1",
        "requests==2.31.0",
        "uvicorn==0.23.2",
        "PyYAML==6.0.1",
        "psutil==5.9.6",
        "python-on-whales==0.65.0",
    ]

    return install_requires


def get_long_description():
    """Read long description from README"""
    with open("README.md", encoding="utf-8") as f:
        long_description = f.read()
    return long_description


setup(
    name="p8hub",
    version=get_version(),
    packages=find_packages(),
    description="Private AI Hub - Host your own Generative AI Services",
    long_description=get_long_description(),
    long_description_content_type="text/markdown",
    author="Viet-Anh Nguyen",
    author_email="vietanh.dev@gmail.com",
    url="https://github.com/vietanhdev/p8hub",
    install_requires=get_install_requires(),
    license="Apache License 2.0",
    keywords="Platform, Local, Generative AI, GPT, LLM, Stable Diffusion, Docker",
    classifiers=[
        "Natural Language :: English",
        "Operating System :: OS Independent",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3 :: Only",
    ],
    package_data={
        "p8hub": [
            "p8hub/frontend-dist/**/*",
            "p8hub/frontend-dist/*",
            "p8hub/apps/**/*",
            "p8hub/apps/*",
        ]
    },
    include_package_data=True,
    entry_points={
        "console_scripts": [
            "p8hub=p8hub.app:main",
            "p8hub.ingest=p8hub.ingest:main",
        ],
    },
)
